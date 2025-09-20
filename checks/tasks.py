import requests
import time
from celery import shared_task
from django.utils import timezone

from .models import CheckResult
from sites.models import Site


@shared_task
def perform_check(site_id):
    try:
        site = Site.objects.get(id=site_id)
    except Site.DoesNotExist:
        return f"Site {site_id} not found"

    start_time = time.time()
    try:
        response = requests.get(site.url, timeout=site.timeout)
        latency = (time.time() - start_time) * 1000
        status = "ok" if response.status_code == site.expected_status_code else "fail"

        result = CheckResult.objects.create(
            site=site,
            status=status,
            status_code=response.status_code,
            latency_ms=latency
        )
        site.status = status
        site.save(update_fields=["status", "updated_at"])
        return f"Check OK for {site.url}: {result.id}"

    except Exception as e:
        latency = (time.time() - start_time)
        result = CheckResult.objects.create(
            site=site,
            status="fail",
            status_code=None,
            latency_ms=latency,
            error_message=str(e),
        )
        site.status = "fail"
        site.save(update_fields=["status", "updated_at"])
        return f"Check FAIL for {site.url}: {str(e)}"

@shared_task
def schedule_checks():
    now = timezone.now()

    sites = Site.objects.filter(active=True)
    for site in sites:
        # если сайт никогда не проверялся → проверить
        last_check = site.checks.order_by("-timestamp").first()
        if not last_check or (now - last_check.timestamp).total_seconds() >= site.check_interval:
            perform_check.delay(site.id)