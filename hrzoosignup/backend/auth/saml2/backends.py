from django.core.cache import cache

from djangosaml2.backends import Saml2Backend
from django.contrib.auth import get_user_model


class SAML2Backend(Saml2Backend):
    def _update_user(self, user, attributes, attribute_mapping, force_save=False):
        oib = attributes['hrEduPersonOIB']
        uid = attributes['hrEduPersonUniqueID']
        cache.set(f'{uid}_oib', oib, 3600 * 5)
        return super()._update_user(user, attributes, attribute_mapping, force_save)

    def save_user(self, user, *args, **kwargs):
        return super().save_user(user, *args, **kwargs)
