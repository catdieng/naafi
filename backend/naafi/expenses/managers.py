from django.db import models


class ExpenseCategoryManager(models.Manager):
    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(type="expense")
