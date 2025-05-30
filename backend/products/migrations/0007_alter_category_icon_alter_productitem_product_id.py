# Generated by Django 4.2.1 on 2023-07-04 20:51

from django.db import migrations, models
import django.db.models.deletion
import products.models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0006_brand_alter_category_parent_category_product_brand'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='icon',
            field=models.ImageField(blank=True, upload_to='categories/'),
        ),
        migrations.AlterField(
            model_name='productitem',
            name='product_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_variations', to='products.product'),
        ),
    ]
