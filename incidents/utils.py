from django.utils import timezone
from .models import Incident

def process_incident(site, new_status):
    """
    Управляет созданием и закрытием инцидентов в зависимости от статуса сайта.
    """
    # Если сайт упал и инцидента ещё нет → создаём
    if new_status == "fail":
        open_incident = site.incidents.filter(end_time__isnull=True).last()
        if not open_incident:
            Incident.objects.create(
                site=site,
                severity="major",  # можно усложнить позже
                description=f"Site {site.url} is down",
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
