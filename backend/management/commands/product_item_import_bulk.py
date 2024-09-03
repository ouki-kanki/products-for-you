import csv
from django.core.management.base import BaseCommand
from django.db import transaction

from products.models import Category, Product, ProductItem, ProductImage

class Command(BaseCommand):
    help = "bulk import productItems and images from csv"

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help="the productItem file")

    def handle(self, *args, **kwargs):
        csv_file = kwargs.get('csv_file')

        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)

            categories = {}
            products = {}
            product_items = {}
            product_images = []

            with transaction.atomic():
                for row in reader:
                    category_name = row['category_name']

                    category = Category(
                        name=category_name,
                        icon=row['category_icon'],
                    )

                    categories[category_name] = category
                    category.save()

                    product_name = row['product_name']
                    product = Product(
                        name=product_name,
                        category=categories[category_name]
                    )

                    products[product_name] = product
                    product.save()

                    sku = row['sku']
                    product_item = ProductItem(
                        product=products[product_name],
                        sku=row['sku'],
                        quantity=row['quantity'],
                        price=row['price'],
                        is_default=row['product_item_is_default'],
                    )

                    product_items[sku] = product_item
                    product_item.save()

                    product_image = ProductImage(
                        product_item=product_items['sku'],
                        image=row['image_url'],
                        is_default=row['image_is_default']
                    )

                    # TODO: have to have the ability to insert multiple images for each item

