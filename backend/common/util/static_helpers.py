from django.utils.html import format_html


def upload_icon(name_of_folder: str, instance, filename):
    '''
    takes the name of the folder in which the file will be uploaded,
    the incance and filename (produced by the framework)
    '''
    return f'{name_of_folder}/images/{instance.name}/{filename}'


def render_icon(obj):
    '''
    take an instance and return the url of the image if it exists
    is mandatory for the name of the field to be "icon" in order to render the icons
    '''
    if obj.icon:
        return format_html('<img src="{}" width="50px" height="50px"/>', obj.icon.url)
    return 'there is no uploaded image'