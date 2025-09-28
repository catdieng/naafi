from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Tax(models.Model):
    TAX_TYPE_CHOICES = (("percentages", "Percentage (%)"), ("fixed", "Fixed Amount"))
    name = models.CharField(max_length=50)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    rate_type = models.CharField(
        max_length=11, choices=TAX_TYPE_CHOICES, default="percentages"
    )
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="taxes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
