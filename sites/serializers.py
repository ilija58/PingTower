from rest_framework import serializers

from .models import Site


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = [
            "id",
            "name",
            "url",
            "check_interval",
            "timeout",
            "expected_status_code",
            "active",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "created_at", "updated_at"]

    def create(self, validated_data):
        site = Site.objects.create(**validated_data)
        site.user.add(self.context["request"].user)
        return site