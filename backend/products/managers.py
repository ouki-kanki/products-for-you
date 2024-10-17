from django.db import models


class VariationManager(models.Manager):
    def all(self):
        # There is no field named "active" this is just for showing the functionality
        return super(VariationManager, self).filter(active=True)

    def sizes(self):
        return super(VariationManager, self).filter(variation_option='size')
