# Generated by Django 4.2.1 on 2023-11-24 22:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_control', '0004_remove_customuser_date_joined_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='user_detail',
        ),
        migrations.DeleteModel(
            name='UserDetail',
        ),
    ]
