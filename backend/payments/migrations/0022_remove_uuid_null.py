# Generated by Django 4.2.1 on 2025-03-22 22:52
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0021_populate_uuid_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shippingplanoption',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
