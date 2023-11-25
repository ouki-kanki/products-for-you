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
        print("this is the url of the icon: ", obj.icon.url)
        return format_html('<img src="{}" width="50px" height="50px"/>', obj.icon.url)
    # return format_html('<img src="{}" widht="50px" height="50px"/>', '/icons/placeholder.jpg')
    return 'no icon'


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