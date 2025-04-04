from urllib.parse import urlparse

from django.conf import settings
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags


def _get_domain(request):
    if not request:
        return None

    host = request.get_host()

    domain = urlparse(f'//{host}').hostname
    if settings.DEBUG:
        domain = domain + ':5173'

    return domain


def _send_email(message, html_message):
    message.attach_alternative(html_message, "text/html")
    message.send()


def send_activation_email(request, user):
    if not user:
        return

    username = user.username if user.username else user.email
    domain = _get_domain(request)

    subject = 'Activate the account Clown!'
    html_message = render_to_string('authentication/activate_email.html', {
        'user': username,
        'domain': domain,
        'uidb64': urlsafe_base64_encode(force_bytes(user.pk)),
    })
    body = strip_tags(html_message)

    # TODO: for production change the receiver to -> user.email
    message = EmailMultiAlternatives(
        subject=subject,
        from_email=None,
        to=settings.EMAIL_RECEIVERS_LIST,
        body=body
    )

    _send_email(message, html_message)


def send_order_completion_email(request, email_address):
    user = request.user

    if not user.is_authenticated:
        pass

    email = email_address

    if not email:
        email = user.email

    if not email:
        raise ValueError("email address not found")

    username = user.username or user.email if hasattr(user, 'email') else email_address

    subject = 'Your order from products from you'
    html_message = render_to_string('orders/order_completion.html', {
        'user': username,
    })
    body = strip_tags(html_message)

    message = EmailMultiAlternatives(
        subject=subject,
        from_email=None,
        to=settings.EMAIL_RECEIVERS_LIST,
        body=body
    )

    _send_email(message, html_message)
