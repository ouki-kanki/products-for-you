# Generated by Django 4.2.1 on 2025-03-18 18:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0056_delete_stock'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShippingZone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Store',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('address', models.TextField()),
                ('zip_code', models.CharField(max_length=20)),
                ('city', models.CharField(choices=[('ATH', 'Athens'), ('LON', 'London')], default='ATH', max_length=4)),
                ('country', models.CharField(choices=[('GR', 'Greece'), ('GB', 'United Kingdom')], default='GR', max_length=4)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('product_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock', to='products.productitem')),
                ('store', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='stock', to='inventory.store')),
            ],
        ),
    ]
