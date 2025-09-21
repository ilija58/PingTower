from rest_framework import serializers

from .models import Site


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = [
            "id",
            "users",
            "name",
            "target",
            "check_type",
            "http_method",
            "port",
            "timeout",
            "check_interval",
            "expected_status_code",
            "degraded_latency_ms",
            "fail_threshold",
            "recovery_threshold",
            "ssl_check_enabled",
            "ssl_expiry_alert_days",
            "domain_check_enabled",
            "domain_expiry_alert_days",
            "status",
            "active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "created_at", "updated_at"]

    def create(self, validated_data):
        site = Site.objects.create(**validated_data)
        site.users.add(self.context["request"].user)
        return site