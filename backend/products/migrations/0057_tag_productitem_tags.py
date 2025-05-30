# Generated by Django 4.2.1 on 2025-03-20 21:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0056_delete_stock'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('slug', models.SlugField(unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='productitem',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='product_items', to='products.tag'),
        ),
    ]
