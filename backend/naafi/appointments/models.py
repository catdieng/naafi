from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from safedelete import SOFT_DELETE
from safedelete.models import SafeDeleteModel

from naafi.customers.models import Customer
from naafi.services.models import Service

User = get_user_model()


class AppointmentStatus(models.TextChoices):
    TODO = "todo", "To do"
    IN_PROGRESS = "in_progress", "In progress"
    WAITING_PARTS = "waiting_parts", "Waiting parts"
    DONE = "done", "Done"
    CANCELLED = "cancelled", "Cancelled"


class Appointment(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE

    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        related_name="appointments",
        null=True,
        blank=True,
    )
    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.SET_NULL,
        related_name="appointments",
        null=True,
        blank=True,
    )
    start = models.DateTimeField()
    end = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.TODO,
    )
    description = models.TextField(blank=True, null=True)
    services = models.ManyToManyField(Service, related_name="appointments")
    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="appointments",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        errors = {}

        # Start & End required
        if not self.start or not self.end:
            errors["start"] = "Start and end times are required."
            errors["end"] = "Start and end times are required."

        # End after Start
        elif self.end <= self.start:
            errors["end"] = "End time must be after start time."

        # Prevent appointments in the past (optional)
        # if self.start and self.start < timezone.now():
        #     errors["start"] = "Start time cannot be in the past."

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()  # ensures validation runs
        super().save(*args, **kwargs)

    @property
    def duration(self):
        if self.start and self.end:
            return self.end - self.start
        return None
