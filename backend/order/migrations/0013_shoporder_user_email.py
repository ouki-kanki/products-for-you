# Generated by Django 4.2.1 on 2025-04-02 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0012_shoporder_session_cart'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoporder',
            name='user_email',
            field=models.EmailField(default='john@gmail.com', max_length=254),
            preserve_default=False,
        ),
    ]
