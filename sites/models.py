from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError
from urllib.parse import urlparse

from django.utils import timezone


class Site(models.Model):
    CHECK_TYPES = [
        ("http", "HTTP/HTTPS"),
        ("ping", "Ping"),
        ("tcp", "TCP Port"),
    ]

    HTTP_METHODS = [
        ("GET", "GET"),
        ("HEAD", "HEAD"),
        ("POST", "POST"),
        ("PUT", "PUT"),
        ("DELETE", "DELETE"),
        ("PATCH", "PATCH"),
    ]

    STATUS_CHOICES = [
        ("ok", "OK"),
        ("fail", "Fail"),
        ("degraded", "Degraded"),
        ("unknown", "Unknown"),
    ]

    TIMEOUT_CHOICES = [
        (1, "1 секунда"),
        (10, "10 секунд"),
        (30, "30 секунд"),
        (60, "60 секунд"),
    ]

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="sites",
        blank=True,
    )

    name = models.CharField(max_length=255)

    target = models.CharField(max_length=500)

    host = models.CharField(max_length=255, blank=True)

    check_type = models.CharField(max_length=20, choices=CHECK_TYPES, default="http")
    http_method = models.CharField(max_length=10, choices=HTTP_METHODS, default="GET")
    port = models.IntegerField(blank=True, null=True)

    timeout = models.IntegerField(choices=TIMEOUT_CHOICES, default=10)
    check_interval = models.IntegerField(default=60)

    expected_status_code = models.IntegerField(default=200)
    degraded_latency_ms = models.IntegerField(default=1500)
    fail_threshold = models.IntegerField(default=3)
    recovery_threshold = models.IntegerField(default=2)

    ssl_check_enabled = models.BooleanField(default=True)
    ssl_expiry_alert_days = models.IntegerField(default=7)
    ssl_expires_at = models.DateTimeField(blank=True, null=True)
    ssl_last_checked_at = models.DateTimeField(blank=True, null=True)
    last_notified_at = models.DateTimeField(blank=True, null=True)
    domain_check_enabled = models.BooleanField(default=True)
    domain_expiry_alert_days = models.IntegerField(default=14)
    domain_expires_at = models.DateTimeField(blank=True, null=True)
    domain_last_checked_at = models.DateTimeField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="unknown", db_index=True)
    fail_count = models.IntegerField(default=0)
    success_streak = models.IntegerField(default=0)
    active = models.BooleanField(default=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["active", "status"]),
            models.Index(fields=["updated_at"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.target})"

    def clean(self):
        if self.check_type == "tcp" and not self.port:
            raise ValidationError({"port": "Для TCP-проверки порт обязателен."})

        if self.check_type == "http":
            parsed = urlparse(self.target)
            if parsed.scheme not in ("http", "https"):
                raise ValidationError({"target": "Для HTTP нужен полный URL со схемой http/https."})
        else:
            if self.target.startswith("http://") or self.target.startswith("https://"):
                raise ValidationError({"target": "Для Ping/TCP укажи домен или IP, а не URL."})

        if self.fail_threshold < 1:
            raise ValidationError({"fail_threshold": "Минимум 1."})
        if self.recovery_threshold < 1:
            raise ValidationError({"recovery_threshold": "Минимум 1."})

    def save(self, *args, **kwargs):
        if not self.host:
            parsed = urlparse(self.target)
            self.host = parsed.hostname or self.target
        super().save(*args, **kwargs)
