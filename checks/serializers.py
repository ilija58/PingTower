from rest_framework import serializers
from .models import CheckResult


class CheckResultSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source="site.name", read_only=True)
    site_target = serializers.CharField(source="site.target", read_only=True)

    class Meta:
        model = CheckResult
        fields = [
            "id",
            "site",
            "site_name",
            "site_target",
            "timestamp",
            "status",
            "status_code",
            "latency_ms",
            "error_type",
            "error_message",
            "created_at",
        ]
        read_only_fields = fields
