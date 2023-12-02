from django.utils.html import format_html

from PIL import Image
from io import BytesIO
from django.core.files import File

def upload_icon(name_of_folder: str, instance, filename):
    '''
    takes the name of the folder in which the file will be uploaded,
    the incance and filename (produced by the framework)
    '''
    print("inside the upload icon method")
    if instance.icon:
        return f'{name_of_folder}/images/{instance.name}/{filename}'
    return f'/media/icons/placeholder.jpg'
        


def render_icon(obj):
    '''
    take an instance and return the url of the image if it exists
    is mandatory for the name of the field to be "icon" in order to render the icons
    '''
    print("inside the render_icon method")
    if obj.icon:
        return format_html('<img src="{}" width="50px" height="50px"/>', obj.icon.url)

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