from django.contrib.auth import get_user_model
from django.db import models

from naafi.categories.models import Category

from .managers import ExpenseCategoryManager

User = get_user_model()


class ExpenseCategory(Category):
    objects = ExpenseCategoryManager()

    class Meta:
        proxy = True
        app_label = "expenses"


class Expense(models.Model):
    CURRENCY_CHOICES = [
        ("USD", "US Dollar"),
        ("EUR", "Euro"),
        ("GBP", "British Pound"),
        ("JPY", "Japanese Yen"),
        ("CAD", "Canadian Dollar"),
        ("XOF", "FCFA"),
    ]

    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="USD")
    date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    supplier = models.CharField(
        max_length=255, blank=True, null=True
    )  # Nom du fournisseur ou tiers
    reference = models.CharField(
        max_length=100, blank=True, null=True
    )  # Référence facture ou pièce
    paid = models.BooleanField(default=False)
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
