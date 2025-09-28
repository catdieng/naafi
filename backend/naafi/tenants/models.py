from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify
from django_tenants.models import DomainMixin, TenantMixin

User = get_user_model()


class Tenant(TenantMixin):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, default="")
    description = models.TextField(null=True, blank=True)
    industry = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    logo = models.ImageField(upload_to="logos/", null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    paid_until = models.DateField(null=True, blank=True)
    on_trial = models.BooleanField(default=False)
    created_on = models.DateField(auto_now_add=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owner_user",
    )

    auto_create_schema = True

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Domain(DomainMixin):
    pass
