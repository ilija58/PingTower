from rest_framework import serializers
from .models import CheckResult

class CheckResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckResult
        fields = [
            "id",
            "site",
            "timestamp",
            "status",
            "status_code",
            "latency_ms",
            "error_message",
        ]
