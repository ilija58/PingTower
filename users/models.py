from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # убираем first_name и last_name
    first_name = None
    last_name = None

    # добавляем своё поле
    full_name = models.CharField(max_length=255, blank=True)
    telegram_chat_id = models.CharField(
        max_length=50, blank=True, null=True, help_text="Telegram chat ID для уведомлений"
    )

    def __str__(self):
        return self.username or self.full_name
