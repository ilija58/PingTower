from django.db import models

class CheckResult(models.Model):
    STATUS_CHOICES = [
        ("ok", "OK"),
        ("fail", "Fail"),
        ("degraded", "Degraded"),
    ]

    site = models.ForeignKey(
        "sites.Site",
        on_delete=models.CASCADE,
        related_name="checks"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    status_code = models.IntegerField(null=True, blank=True)
    latency_ms = models.FloatField(null=True, blank=True)  # время ответа в миллисекундах
    error_message = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.site.name} - {self.status} ({self.timestamp})"


