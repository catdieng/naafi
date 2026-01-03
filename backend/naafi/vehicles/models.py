from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q, UniqueConstraint
from safedelete import SOFT_DELETE
from safedelete.models import SafeDeleteModel

User = get_user_model()


class Brand(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    name = models.CharField(max_length=50)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_brands",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["name"],
                condition=Q(deleted__isnull=True),
                name="brand_unique_active_name",
            ),
        ]

    def __str__(self):
        return self.name


class VehicleModel(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    name = models.CharField(max_length=50)
    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name="vehicle_models",
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_vehicle_models",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["name", "brand"],
                condition=Q(deleted__isnull=True),
                name="vehicle_model_unique_active_per_brand",
            ),
        ]

    def __str__(self):
        return f"{self.brand} {self.name}"


class Vehicle(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    customer = models.ForeignKey(
        "customers.Customer",
        related_name="vehicles",
        on_delete=models.PROTECT,
    )

    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        related_name="vehicles",
        null=True,
        blank=True,
    )

    model = models.ForeignKey(
        VehicleModel,
        on_delete=models.PROTECT,
        related_name="vehicles",
    )

    license_plate = models.CharField(
        max_length=15,
        db_index=True,
    )

    vin = models.CharField(
        max_length=17,
        null=True,
        blank=True,
    )

    year = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="created_vehicles",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["license_plate"],
                condition=Q(deleted__isnull=True),
                name="vehicle_unique_active_license_plate",
            ),
            UniqueConstraint(
                fields=["vin"],
                condition=Q(vin__isnull=False, deleted__isnull=True),
                name="vehicle_unique_active_vin",
            ),
        ]

    def __str__(self):
        return f"{self.license_plate} - {self.model} ({self.year})"
