import os
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

# used inside the model to upload the image to certain folder
def upload_icon(root_folder_name: str, parent_folder_name: str, variation_name: str, images_folder_name: str, instance, name_of_field: str, filename=''):
    '''
    Generates the upload path for product images
    Args:
        root_folder_name (str): this is the name of the folder after media folder
        parent_folder_name for example if products is the parent and variations the child the name would be 'products'
        variation_name (str): it will be use to name the folder of the variation
        images_folder_name (str): this is the name of the folder that will contain the images
        instance (ProductImage): this is the instance of the model
        name_of_field (str): this is the field name for the image in the model. it has to be the same as the the model field 
        file_name_from_parent (str): this is the value that the __str__ method of the parent produces.it will be used to generate the filename
        filename (str): this is name for the image from the uploaded file ti will be concat with file_name_from_parent
    EXAMPLE: product/t_shirt/product_variations/images/foo.jpg
    Returns:
        str: the path of the image or the thumb
    '''
    media_root = settings.MEDIA_ROOT

    # only if there is image or thumb 
    # if getattr(instance, name_of_field):
        # remove invalid chars if any
    parent_folder_name, variation_name = map(lambda x: sanitize_file_name(x), [parent_folder_name, variation_name]) 

    path = os.path.join(root_folder_name, parent_folder_name, variation_name, images_folder_name)
    # out_path = os.path.join(media_root, path, filename)
    out_path = os.path.join(root_folder_name, parent_folder_name, variation_name, images_folder_name, filename)
    test_path = os.path.join(media_root, root_folder_name, 'test', f'{filename}.png')

    if instance.remove_background and name_of_field == 'thumbnail':
        remove_background(getattr(instance, 'image'), test_path)            
    return out_path
    
    # return '/media/icons/placeholder.jpg'
    # return os.path.join(media_root, 'icons', 'placeholder.jpg')

    
def render_icon(obj, model_property):
    '''
    needs the obj and the property of the model responsible for the image
    take an instance and return the url of the image if it exists
    '''
    if getattr(obj, model_property):
        return format_html('<img src="{}" width="50px" height="50px"/>', getattr(obj, model_property).url)

    return format_html('<img src="{}" width="50px height="50px"/>', '/media/icons/placeholder.jpg')


def render_link_with_image(value):
    '''
    take a url and return an image link to use inside the customfile widget inside the admin
    '''
    return  f'''<a href="{value.url}" target="_blank">
                    <img 
                    src="{value.url}" alt="{value}" 
                    width="100" height="100"
                    style="object-fit: cover;"
                    />
                </a>'''

def make_thumbnail(image, size=(300, 200)):
    '''
    takes the imgage and the desired size anr return the resized image
    '''
    img = Image.open(image.path)
    img.convert('RGB')
    img.thumbnail(size)

    thumb_io = BytesIO()
    img.save(thumb_io, 'JPEG', quality=85)

    thumbnail = File(thumb_io, name=image.name)
    return thumbnail