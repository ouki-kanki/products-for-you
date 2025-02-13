import os
import cv2
import tempfile
import numpy as np
from io import BytesIO

from django.core.files import File
from django.core.files.storage import default_storage
from django.core.exceptions import SuspiciousFileOperation

from PIL import Image


def generate_thumbnail_v2(instance, image_field, suffix, size=(300, 200)):
    """
    creates a thumbnail from the existing image, return the name of the thumb

    instance: the model instance
    image_field: the name of the field that holds the image
    size: the size of the output thumb tuple (width, height)
    """
    if not getattr(instance, image_field):
        return

    original_image = Image.open(getattr(instance, image_field))
    image = original_image.convert("RGB")    
    image.thumbnail(size, Image.LANCZOS)
    temp_thumb = BytesIO()
    image.save(temp_thumb, "PNG")
    temp_thumb.seek(0)

    original_image.close()
    image.close()

    relative_path = getattr(instance, image_field).name
    file_name = relative_path.split('/')[-1]
    file_name = 'thumb_' + file_name
    thumb_file = File(temp_thumb, name=file_name)

    return thumb_file


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


# OBSOLETE FOR REMOVE 
def compare_images_delete_prev_if_not_same(instance, old_instance, name_of_image_field: str, **kwargs) -> bool:
    """
    compares the prev and currenct instance on the provided field and if they are not the same it deletes the image from disk
    return: returns a boolean of the comparison
    """
    force_delete = kwargs.get('force_delete', False)
    reference_to_prev_image = getattr(old_instance, name_of_image_field)
    reference_to_current_image = getattr(instance, name_of_image_field)
    old_image_path = reference_to_prev_image.path

    is_same = reference_to_prev_image == reference_to_current_image

    if not is_same or force_delete:
        try:
            if default_storage.exists(old_image_path):
                default_storage.delete(old_image_path)
        except SuspiciousFileOperation:
            # TODO: throw an error and use a manager to show the errors on the admin
            print(f"file not found in {old_image_path}")
        except Exception as e:
            print("there was an error", e)
    
    return is_same
    

def delete_image_from_filesystem(instance, name_of_field):
    """
    takes the inctance and the name of the field for the image and
    deletes the file from disk
    instance: item instance
    name_of_field (str): the name of the image_field
    """
    try:
        item_path = getattr(instance, name_of_field).path
        if os.path.isfile(item_path):
            os.remove(item_path)
    except Exception as e:
        # TODO: throw an error and catch it in the manager to so in the admin some notif
        print("yo cannot del")    
