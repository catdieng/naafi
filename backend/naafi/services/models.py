from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from naafi.categories.models import Category
from naafi.taxes.models import Tax

from .managers import ServiceCategoryManager

User = get_user_model()


class ServiceCategory(Category):
    objects = ServiceCategoryManager()

    class Meta:
        proxy = True
        app_label = "services"


class Service(models.Model):
    name = models.CharField(_("name"), max_length=30, unique=True)
    slug = models.SlugField(_("slug"), max_length=30, unique=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.DurationField(
        help_text=_("Duration of the service (e.g., 1 hour 30 minutes)"),
        blank=True,
        null=True,
    )
    description = models.TextField(_("description"), blank=True, null=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("updated at"), auto_now=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    custom_taxes = models.ManyToManyField(Tax, blank=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(_("is active"), default=True)

    class Meta:
        verbose_name = _("Service")
        verbose_name_plural = _("Services")
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_applicable_taxes(self):
        # Use custom taxes if defined, else fall back to category taxes
        if self.custom_taxes.exists():
            return self.custom_taxes.all()
        if self.category and hasattr(self.category, "default_taxes"):
            return self.category.default_taxes.all()
        return Tax.objects.none()
