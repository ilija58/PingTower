import socket
import ssl
import time
from datetime import datetime
from urllib.parse import urlparse

from django.utils import timezone
from pythonping import ping
import requests
from celery import shared_task

from checks.models import CheckResult
from incidents.utils import process_incident
from sites.models import Site

def check_ssl_expiry(host, port=443):
    """
    Проверяет срок действия SSL-сертификата.
    Возвращает (days_left, expiry_date).
    """
    context = ssl.create_default_context()
    with socket.create_connection((host, port), timeout=5) as sock:
        with context.wrap_socket(sock, server_hostname=host) as ssock:
            cert = ssock.getpeercert()
            expiry = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
            return (expiry - timezone.now()).days, expiry


@shared_task
def perform_check(site_id):
    try:
        site = Site.objects.get(id=site_id)
    except Site.DoesNotExist:
        return f"Site {site_id} not found"

    start_time = time.time()
    status = "fail"
    status_code = None
    latency = None
    error_type = "other"
    error_message = None

    try:
        if site.check_type == "http":
            response = requests.request(
                site.http_method,
                site.target,
                timeout=site.timeout,
                verify=site.ssl_check_enabled,
            )
            latency = (time.time() - start_time) * 1000
            status_code = response.status_code

            if response.status_code == site.expected_status_code:
                status = "ok"
                error_type = "none"
            else:
                status = "fail"
                error_type = "http_error"

        elif site.check_type == "ping":
            resp = ping(site.host, count=1, timeout=site.timeout)
            latency = resp.rtt_avg_ms
            if resp.success():
                status = "ok"
                error_type = "none"
            else:
                status = "fail"
                error_type = "timeout"

        elif site.check_type == "tcp":
            with socket.create_connection((site.host, site.port), timeout=site.timeout):
                latency = (time.time() - start_time) * 1000
                status = "ok"
                error_type = "none"

    except requests.exceptions.Timeout:
        error_type = "timeout"
        error_message = "HTTP timeout"
    except requests.exceptions.ConnectionError:
        error_type = "connection_error"
        error_message = "Connection error"
    except ssl.SSLError as e:
        error_type = "ssl_error"
        error_message = str(e)
    except Exception as e:
        error_type = "other"
        error_message = str(e)

    # деградация по задержке
    if status == "ok" and latency and latency > site.degraded_latency_ms:
        status = "degraded"
        error_type = "latency"
        error_message = f"High latency: {int(latency)}ms"

    # сохраняем результат
    result = CheckResult.objects.create(
        site=site,
        status=status,
        status_code=status_code,
        latency_ms=latency,
        error_type=error_type,
        error_message=error_message,
    )

    # обновляем fail_count / success_streak
    if status == "ok":
        site.success_streak += 1
        site.fail_count = 0
        if site.success_streak >= site.recovery_threshold:
            site.status = "ok"
            process_incident(site, "ok")
    elif status == "degraded":
        site.fail_count = 0
        site.success_streak = 0
        site.status = "degraded"
    else:  # fail
        site.fail_count += 1
        site.success_streak = 0
        if site.fail_count >= site.fail_threshold:
            site.status = "fail"
            process_incident(site, "fail")

    site.save(update_fields=["status", "fail_count", "success_streak", "updated_at"])
    return f"Check {status.upper()} for {site.target} (id={result.id})"

@shared_task
def check_ssl_expiry_task(site_id):
    try:
        site = Site.objects.get(id=site_id)
    except Site.DoesNotExist:
        return f"Site {site_id} not found"

    parsed = urlparse(site.target)
    if parsed.scheme != "https" or not site.ssl_check_enabled:
        return f"SSL check skipped for {site.target}"

    try:
        days_left, expiry_date = check_ssl_expiry(parsed.hostname, parsed.port or 443)
        site.ssl_expires_at = expiry_date
        site.ssl_last_checked_at = timezone.now()

        if days_left <= site.ssl_expiry_alert_days:
            site.status = "degraded"
            site.save(update_fields=["status", "ssl_expires_at", "ssl_last_checked_at"])
            return f"SSL expiring soon for {site.target}: {days_left} days left"

        site.save(update_fields=["ssl_expires_at", "ssl_last_checked_at"])
        return f"SSL OK for {site.target}, expires in {days_left} days"

    except Exception as e:
        site.ssl_last_checked_at = datetime.now()
        site.status = "degraded"
        site.save(update_fields=["status", "ssl_last_checked_at"])
        return f"SSL check failed for {site.target}: {e}"


@shared_task
def check_domain_expiry_task(site_id):
    try:
        site = Site.objects.get(id=site_id)
    except Site.DoesNotExist:
        return f"Site {site_id} not found"

    if not site.domain_check_enabled or not site.domain_expires_at:
        return f"Domain check skipped for {site.target}"

    days_left = (site.domain_expires_at - timezone.now()).days
    site.domain_last_checked_at = timezone.now()

    if days_left <= site.domain_expiry_alert_days:
        site.status = "degraded"
        site.save(update_fields=["status", "domain_last_checked_at"])
        return f"Domain expiring soon for {site.target}: {days_left} days left"

    site.save(update_fields=["domain_last_checked_at"])
    return f"Domain OK for {site.target}, expires in {days_left} days"

@shared_task
def schedule_all_checks():
    """
    Запускает проверки доступности только для тех сайтов,
    чей check_interval уже истёк.
    """
    now = timezone.now()
    for site in Site.objects.filter(active=True):
        if site.updated_at:
            elapsed = (now - site.updated_at).total_seconds()
        else:
            elapsed = site.check_interval + 1

        if elapsed >= site.check_interval:
            perform_check.delay(site.id)


@shared_task
def schedule_all_ssl_checks():
    for site in Site.objects.filter(active=True, ssl_check_enabled=True):
        check_ssl_expiry_task.delay(site.id)


@shared_task
def schedule_all_domain_checks():
    for site in Site.objects.filter(active=True, domain_check_enabled=True):
        check_domain_expiry_task.delay(site.id)