# Generated by Django 4.2.1 on 2025-03-22 22:51

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0019_remove_shippingplanoption_estimated_delivery_time_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='shippingplanoption',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
    ]
