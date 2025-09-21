
from datetime import timedelta

import requests
from django.conf import settings
from django.utils import timezone
from .models import Incident

COOLDOWN = timedelta(seconds=7)

def send_telegram_message(chat_id: str, text: str):
    """
    Отправляет уведомление в Telegram конкретному пользователю.
    """

    token = getattr(settings, "TELEGRAM_BOT_TOKEN", None)
    if not token or not chat_id:
        return

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}

    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"⚠️ Telegram send error: {e}")


def process_incident(site, new_status):
    """
    Управляет созданием и закрытием инцидентов в зависимости от статуса сайта.
    """
    now = timezone.now()

    # Если сайт упал и инцидента ещё нет → создаём
    if new_status == "fail":
        open_incident = site.incidents.filter(end_time__isnull=True).last()
        if not open_incident:
            Incident.objects.create(
                site=site,
                severity="major",  # можно усложнить позже
                description=f"Site {site.target} is down",
            )

    # Если сайт восстановился → закрываем последний открытый инцидент
    if new_status == "ok":
        open_incident = site.incidents.filter(end_time__isnull=True).last()
        if open_incident:
            open_incident.end_time = timezone.now()
            open_incident.description = (
                open_incident.description or ""
            ) + f"\nResolved at {open_incident.end_time}"
            open_incident.save()


    #if (now - site.last_notified_at) < COOLDOWN:
        #return

    if new_status == "fail":
        msg = f"Сайт <b>{site.name}</b> ({site.target}) недоступен!"
    elif new_status == "ok":
        msg = f"Сайт <b>{site.name}</b> снова работает."
    elif new_status == "degraded":
        msg = f" Сайт <b>{site.name}</b> ({site.target}) работает нестабильно."
    else:
        msg = None

    if msg:
        for user in site.users.all():
            if getattr(user, "telegram_chat_id", None):
                send_telegram_message(user.telegram_chat_id, msg)

    site.last_notified_at = now
    site.save(update_fields=["last_notified_at"])





