from urllib.parse import urlparse

from django.conf import settings
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags


def send_activation_email(request, user):
    if not user:
        return

    username = user.username if user.username else user.email
    host = request.get_host()
    domain = urlparse(f'//{host}').hostname

    if settings.DEBUG:
        domain = domain + ':5173'

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

    message.attach_alternative(html_message, "text/html")
    message.send()
