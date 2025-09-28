import contextlib

from django.apps import AppConfig


class CategoriesConfig(AppConfig):
    name = "naafi.categories"
    label = "categories"
    verbose_name = "Categories"

    def ready(self) -> None:
        with contextlib.suppress(ImportError):
            pass
