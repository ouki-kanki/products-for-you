# Generated by Django 4.2.1 on 2024-10-18 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0044_brand_icon_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='is_featured',
            field=models.BooleanField(default=False),
        ),
    ]
