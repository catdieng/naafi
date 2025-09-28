from django.db import models


class ServiceCategoryManager(models.Manager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(type="service")
