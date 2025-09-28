import contextlib

from django.apps import AppConfig


class AppointmentsConfig(AppConfig):
    name = "naafi.appointments"
    label = "appointments"
    verbose_name = "Appointments"

    def ready(self) -> None:
        with contextlib.suppress(ImportError):
            pass
