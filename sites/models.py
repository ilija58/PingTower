from django.conf import settings
from django.db import models

class Site(models.Model):
    STATUS_CHOICES = [
        ("up", "Up"),
        ("down", "Down"),
        ("degraded", "Degraded"),
        ("unknown", "Unknown"),
    ]

    SSL_STATUS_CHOICES = [
        ("true", "Available"),
        ("false", "Unavailable"),
        ("unknown", "Unknown"),
    ]

    user = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="sites"
    )
    name = models.CharField(max_length=255)
    url = models.URLField(unique=True)
    check_interval = models.IntegerField(default=60)
    timeout = models.IntegerField(default=5)
    expected_status_code = models.IntegerField(default=200)
    active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="unknown")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    #ssl_status = models.CharField(max_length=20, choices=SSL_STATUS_CHOICES, default="unknown")
    #ssl_expired = models.DateTimeField()

    def __str__(self):
        return f"{self.name} ({self.url})"

