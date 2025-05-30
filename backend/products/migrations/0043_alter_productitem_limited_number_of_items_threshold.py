# Generated by Django 4.2.1 on 2024-09-01 22:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0042_productitem_limited_number_of_items_threshold'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productitem',
            name='limited_number_of_items_threshold',
            field=models.PositiveIntegerField(default=3, help_text='below and including this number client will show "limited number of items"'),
        ),
    ]
