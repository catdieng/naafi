import contextlib

from django.apps import AppConfig


class VehicleApp(AppConfig):
    name = "naafi.vehicles"
    verbose_name = "Vehicles"
    label = "vehicles"

    def ready(self):
        with contextlib.suppress(ImportError):
            pass  # type: ignore
