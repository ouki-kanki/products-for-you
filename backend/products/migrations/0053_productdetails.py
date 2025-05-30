# Generated by Django 4.2.1 on 2025-03-13 21:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0052_rename_favorite_favoriteproductitem'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('width', models.DecimalField(decimal_places=1, help_text='measurement in cm', max_digits=5)),
                ('height', models.DecimalField(decimal_places=1, help_text='measurement in cm', max_digits=5)),
                ('length', models.DecimalField(decimal_places=1, help_text='measurement in cm', max_digits=5)),
                ('weight', models.IntegerField(help_text='weight in grams', null=True)),
                ('product_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_details', to='products.productitem')),
            ],
        ),
    ]
