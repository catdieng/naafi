from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from mptt.models import MPTTModel, TreeForeignKey

from naafi.taxes.models import Tax

User = get_user_model()


class Category(MPTTModel):
    CATEGORY_TYPES = (
        ("service", "Service"),
        ("expense", "Expense"),
    )

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, editable=False)
    type = models.CharField(max_length=10, choices=CATEGORY_TYPES)
    parent = TreeForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    default_taxes = models.ManyToManyField(Tax, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class MPTTMeta:
        order_insertion_by = ["name"]

    class Meta:
        db_table = "categories"
        constraints = [
            models.UniqueConstraint(
                fields=["slug", "type"], name="unique_category_slug_per_type"
            )
        ]

    def save(self, *args, **kwargs):
        # Optional: track if name changed
        if self.pk:
            old = Category.objects.get(pk=self.pk)
            if old.name != self.name:
                self.slug = slugify(self.name)
        elif not self.slug:
            self.slug = slugify(self.name)

        # Uniqueness check
        qs = Category.objects.filter(slug=self.slug, type=self.type).exclude(pk=self.pk)
        if qs.exists():
            raise ValidationError(
                f"A category with slug '{self.slug}' and type '{self.type}' already exists."
            )

        super().save(*args, **kwargs)
