# Generated by Django 4.2.1 on 2025-03-22 22:52
import uuid
from django.db import migrations


def gen_uuid(apps, schema_editor):
    MyModel = apps.get_model("payments", "ShippingPlanOption")
    for row in MyModel.objects.all():
        row.uuid = uuid.uuid4()
        row.save(update_fields=["uuid"])


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0020_shippingplanoption_uuid'),
    ]

    operations = [
        migrations.RunPython(gen_uuid, reverse_code=migrations.RunPython.noop)
    ]
