import os
import cv2
import tempfile
import numpy as np
from io import BytesIO

from django.core.files import File
from django.core.files.storage import default_storage

from PIL import Image


def generate_thumbnailV2(instance, name_of_field, size=(300, 200)):
    """
    creates a thumbnail from the existing image and deletes the original image

    instance: the model instance
    name_of_field: the name of the field for the image
    size: the size of the output thumb
    """
    if not getattr(instance, name_of_field):
        return

    
    # with Image.open(getattr(instance, name_of_field)) as original_image:
    original_image = Image.open(getattr(instance, name_of_field))
    image = original_image.convert("RGB")    
    image.thumbnail(size, Image.ANTIALIAS)
    temp_thumb = BytesIO()
    image.save(temp_thumb, "JPEG")
    temp_thumb.seek(0)

    original_image.close()
    image.close()

    name_of_the_file = getattr(instance, name_of_field).name
    # remove the portion before / othewise it will create a subforlder with same name as the parent folder
    category_name = instance.name
    cleared_name_the_file = name_of_the_file.split('/')[-1]
    category_with_filename = f'{category_name}_{cleared_name_the_file}'

    image_file = File(temp_thumb, name=category_with_filename)
    # temp_thumb.close()

    return image_file
    

    # # delete the original image and save the temp_file 
    # if default_storage.exists(name_of_the_file):
    #     default_storage.delete(name_of_the_file)


def generate_thumbnail(instance, size=(300, 200)):
    instance.refresh_from_db()
    img = Image.open(instance.image.path)
    img.convert('RGB')
    img.thumbnail(size)

    thumb_io = BytesIO()
    img.save(thumb_io, 'JPEG', quality=85)
    base_name = os.path.basename(instance.image.name)  # because this returns the alleready created path, i want the name
    thumb_name = f'thumbnail_{base_name}'  # gets the name from the uploaded file.

    # this will the upload method after that
    instance.thumbnail.save(thumb_name, File(thumb_io), save=False)
    thumb_io.close()


def remove_background(input_image_field, output_path, col_low=(0, 0, 100), col_up=(50, 50, 255)):
    if not input_image_field:
        return
    
    image = cv2.imread(input_image_field.path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # second approach .needs refinement
    # hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    # mask = cv2.inRange(hsv, col_low, col_up)

    _, mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    result = np.zeros((image.shape[0], image.shape[1], 4), dtype=np.uint8)
    cv2.drawContours(result, contours, -1, (255, 255, 255, 255), thickness=cv2.FILLED)

    result[:, :, :3] = image
    cv2.imwrite(output_path, result)