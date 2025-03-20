from django.utils.translation import gettext_lazy as _


class CountryCode:
    GREECE = 'GR'
    UNITED_KINGDOM = 'GB'

    choices = (
        (GREECE, _('Greece')),
        (UNITED_KINGDOM, _('United Kingdom')),
    )


class CityCode:
    ATHENS = 'ATH'
    LONDON = 'LON'

    choices = (
        (ATHENS, _("Athens")),
        (LONDON, _("London"))
    )

