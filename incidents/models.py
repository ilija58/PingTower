from django.db import models
from django.db import models
from django.utils import timezone

class Incident(models.Model):
    SEVERITY_CHOICES = [
        ("minor", "Minor"),
        ("major", "Major"),
        ("critical", "Critical"),
    ]

    site = models.ForeignKey(
        "sites.Site",
        on_delete=models.CASCADE,
        related_name="incidents"
    )
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default="major")
    description = models.TextField(blank=True, null=True)

    def is_active(self):
        return self.end_time is None

    def duration(self):
        if self.end_time:
            return self.end_time - self.start_time
        return timezone.now() - self.start_time

    def __str__(self):
        return f"Incident on {self.site.name} ({'active' if self.is_active() else 'resolved'})"

