from django.contrib.auth import get_user_model
from django.db import models, transaction
from django.db.models import F, Sum
from django.utils import timezone

from naafi.customers.models import Customer
from naafi.services.models import Service
from naafi.taxes.models import Tax

User = get_user_model()


class Invoice(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True, null=True)
    issue_date = models.DateField(
        default=timezone.now,
        null=True,
        blank=True,
    )
    due_date = models.DateField(
        null=True,
        blank=True,
    )
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, null=True, related_name="customers"
    )
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="invoices"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def update_totals(self):
        with transaction.atomic():
            # Lock the invoice to prevent concurrent updates
            invoice = Invoice.objects.select_for_update().get(pk=self.pk)

            items = invoice.items.all()
            subtotal = (
                items.aggregate(sum=Sum(F("unit_price") * F("quantity")))["sum"] or 0
            )

            total_tax = (
                InvoiceItemTax.objects.filter(invoice_item__invoice=invoice).aggregate(
                    sum=Sum("amount")
                )["sum"]
                or 0
            )

            invoice.subtotal = subtotal
            invoice.total_tax = total_tax
            invoice.total = subtotal + total_tax
            invoice.save()


class InvoiceItemTax(models.Model):
    invoice_item = models.ForeignKey(
        "InvoiceItem", on_delete=models.CASCADE, related_name="taxes"
    )
    tax = models.ForeignKey(Tax, on_delete=models.PROTECT)
    amount = models.DecimalField(
        max_digits=10, decimal_places=2
    )  # Calculated tax amount


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(
        "Invoice", on_delete=models.CASCADE, related_name="items"
    )
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.unit_price * self.quantity

    def calculate_taxes(self):
        taxes = self.service.get_applicable_taxes()
        for tax in taxes:
            tax_amount = (self.subtotal * tax.rate) / 100
            InvoiceItemTax.objects.create(invoice_item=self, tax=tax, amount=tax_amount)

    def save(self, *args, **kwargs):
        if not self.pk or self._has_changed():  # Only if new or modified
            if not self.unit_price:
                self.unit_price = self.service.price
            super().save(*args, **kwargs)
            self.calculate_taxes()
            self.invoice.update_totals()

    def _has_changed(self):
        if not self.pk:
            return True
        old = InvoiceItem.objects.get(pk=self.pk)
        return (old.unit_price != self.unit_price) or (old.quantity != self.quantity)
