import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pingtower.settings")

app = Celery("pingtower")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    from checks.tasks import schedule_all_checks, schedule_all_ssl_checks, schedule_all_domain_checks

    sender.add_periodic_task(10.0, schedule_all_checks.s(), name="Run availability checks")

    sender.add_periodic_task(
        crontab(hour=1, minute=0),
        schedule_all_ssl_checks.s(),
        name="Run SSL expiry checks",
    )

    sender.add_periodic_task(
        crontab(hour=1, minute=0, day_of_week=1),
        schedule_all_domain_checks.s(),
        name="Run domain expiry checks",
    )