import contextlib

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class TenantsConfig(AppConfig):
    name = "naafi.tenants"
    label = "tenants"
    verbose_name = _("Tenants")
    
    def ready(self):
        with contextlib.suppress(ImportError):
            import naafi.tenants.signals # type: ignore
