from django.contrib.admin.widgets import AdminFileWidget
from django.utils.html import format_html

from common.util.static_helpers import render_link_with_image


class CustomAdminFileWidget(AdminFileWidget):
    """
    show image thumb inside the admin
    """
    def render(self, name, value, attrs=None, renderer=None):
        result = []

        if hasattr(value, "url"):
            result.append(render_link_with_image(value))
        result.append(super().render(name, value, attrs, renderer))

        return format_html("".join(result))
