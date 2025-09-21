import requests
from django.core.management.base import BaseCommand
from django.conf import settings
from users.models import User


class Command(BaseCommand):
    help = "Синхронизирует telegram_chat_id для пользователей на основе getUpdates"

    def handle(self, *args, **options):
        token = settings.TELEGRAM_BOT_TOKEN
        if not token:
            self.stdout.write(self.style.ERROR("TELEGRAM_BOT_TOKEN не задан в settings.py"))
            return

        url = f"https://api.telegram.org/bot{token}/getUpdates"
        try:
            resp = requests.get(url, timeout=10)
            data = resp.json()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Ошибка запроса: {e}"))
            return

        results = data.get("result", [])
        if not results:
            self.stdout.write(self.style.WARNING("Нет новых сообщений боту"))
            return

        updated_count = 0

        for update in results:
            message = update.get("message") or {}
            chat = message.get("chat") or {}
            tg_username = chat.get("username")
            chat_id = chat.get("id")

            if not tg_username or not chat_id:
                continue

            try:
                user = User.objects.get(username=tg_username)
                if user.telegram_chat_id != str(chat_id):
                    user.telegram_chat_id = str(chat_id)
                    user.save(update_fields=["telegram_chat_id"])
                    updated_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Обновлён user={user.username}, chat_id={chat_id}"
                        )
                    )
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f"Нет пользователя с username={tg_username}")
                )

        if updated_count == 0:
            self.stdout.write(self.style.WARNING("Ни один пользователь не обновлён"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Обновлено {updated_count} пользователей"))
