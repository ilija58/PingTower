from rest_framework import serializers
from .models import Incident

class IncidentSerializer(serializers.ModelSerializer):
    duration_seconds = serializers.SerializerMethodField()

    class Meta:
        model = Incident
        fields = [
            "id",
            "site",
            "start_time",
            "end_time",
            "severity",
            "description",
            "duration_seconds",
        ]

    def get_duration_seconds(self, obj):
        return int(obj.duration().total_seconds())
