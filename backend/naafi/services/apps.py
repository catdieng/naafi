import contextlib

from django.apps import AppConfig


class ServicesConfig(AppConfig):
    name = "naafi.services"
    label = "services"
    verbose_name = "Services"

    def ready(self):
        with contextlib.suppress(ImportError):
            pass  # type: ignore
