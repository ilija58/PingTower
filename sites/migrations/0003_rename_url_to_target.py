from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("sites", "0001_initial"),
        ("sites", "0002_rename_owner_site_user"),
    ]

    operations = [
        migrations.RenameField(
            model_name="site",
            old_name="url",
            new_name="target",
        ),
    ]