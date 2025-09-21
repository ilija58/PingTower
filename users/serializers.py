from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "password", "telegram_chat_id"]

    def create(self, validated_data):
        user = User(
            username = validated_data["username"],
            email = validated_data["email"],
            full_name = validated_data["full_name"],
            telegram_chat_id = validated_data["telegram_chat_id"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name", "telegram_chat_id"]
