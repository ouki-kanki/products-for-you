import os

from django.core.files.base import ContentFile
from django.utils.html import format_html
from django.core.exceptions import ValidationError
from django.conf import settings

from PIL import Image
from io import BytesIO
from django.core.files import File

from services.imageServices import remove_background


def sanitize_file_name(item_name):
    if item_name is None:
        # TODO: use this error inside the admin to show an error message
        raise ValidationError("cannot create name from the parent item. check the name of the parent item and if the parent item exists")
    cleaned_value = ''.join(c if c.isalnum() or c in {'_', '-'} else '_' for c in item_name)

    return cleaned_value


def upload_category_image():
    media_root = settings.MEDIA_ROOT


# used inside the model to upload the image to certain folder
def upload_icon(root_folder_name: str, parent_folder_name: str, variation_name: str, images_folder_name: str, instance, name_of_field: str, filename=''):
    """
    Generates the upload path for product images
    Args:
        variation_name (str): it will be use to name the folder of the variation
        images_folder_name (str): this is the name of the folder that will contain the images
        instance (ProductImage): this is the instance of the model
        name_of_field (str): this is the field name for the image in the model. it has to be the same as the the model field 
        filename (str): this is name for the image from the uploaded file ti will be concat with file_name_from_parent
    EXAMPLE: product/t_shirt/product_variations/images/foo.jpg
    Returns:
        str: the path of the image or the thumb
    """

    media_root = settings.MEDIA_ROOT

    # remove invalid chars if any
    parent_folder_name, variation_name = map(lambda x: sanitize_file_name(x), [parent_folder_name, variation_name]) 

    # out_path = os.path.join(media_root, path, filename)
    out_path = os.path.join(root_folder_name, parent_folder_name, variation_name, images_folder_name, filename)
    test_path = os.path.join(media_root, root_folder_name, 'test', f'{filename}.png')

    if instance.remove_background and name_of_field == 'thumbnail':
        remove_background(getattr(instance, 'image'), test_path)            
    return out_path
    

def render_icon(obj, model_property):
    """
    needs the obj and the property of the model responsible for the image
    take an instance and return the url of the image if it exists
    """

    if getattr(obj, model_property):
        return format_html('<img src="{}" width="50px" height="50px"/>', getattr(obj, model_property).url)
    return format_html('<img src="{}" width="50px height="50px"/>', '/media/icons/placeholder.jpg')


def render_link_with_image(value):
    """
    take a url and return an image link to use inside the custom file widget inside the admin
    """
    return (
        f'<a href="{value.url}" target="_blank">\n'
        f'<img\n' 
        f'src="{value.url}" alt="{value}"\n' 
        f'width="100" height="100"\n'
        f'style="object-fit: cover; "\n'
        f'/></a>'
    )


def make_thumbnail(image, size=(300, 200)):
    """
    takes the image file and the desired size and returns the resized image
    """
    try:
        img = Image.open(image)
        img.convert('RGB')
        img.thumbnail(size)
        thumb_io = BytesIO()
        img.save(thumb_io, 'JPEG', quality=85)
    except OSError as e:
        raise ValueError(f"cannot convert the thumbnail: {e}")

    thumbnail = ContentFile(thumb_io.getvalue(), name=image.name)
    # thumbnail = File(thumb_io, name=image.name)
    return thumbnail


# TODO: replace upload_product_image upload_product_thumb
def upload_product_item_image_v2(instance, filename, is_thumb=False):
    variation_name = str(instance.product_item)
    folder_name = 'thumbnails' if is_thumb else 'images'
    sub_folder_name = 'thumbnail' if is_thumb else 'image'
    return upload_icon(
        'products',
        instance.product_item.product.name,
        variation_name,
        f'{folder_name}',
        instance,
        f'{sub_folder_name}',
        filename)


def upload_product_item_image(instance, filename):
    variation_name = str(instance.product_item)
    return upload_icon(
        'products',
        instance.product_item.product.name,
        variation_name,
        'images',
        instance,
        'image',
        filename)


def upload_product_thumb(instance, filename):
    """
    uploads to media/products/<product_name>/<variation_name>/thumbnails/thumbnail
    """
    variation_name = str(instance.product_item)
    return upload_icon(
        'products',
        instance.product_item.product.name,
        variation_name,
        'thumbnails',
        instance,
        'thumbnail',
        filename)


def upload_category_icon(instance, filename):
    # NOTE: this will save to /images/categoryname/filename
    return upload_icon('category', instance, filename, 'icon', 'name')
