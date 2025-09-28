from rest_framework import serializers

from naafi.customers.models import Customer
from naafi.customers.serializers import CustomerSimpleSerializer
from naafi.services.models import Service

from .models import Invoice, InvoiceItem, InvoiceItemTax


class InvoiceItemTaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItemTax
        fields = ["id", "tax", "amount"]
        read_only_fields = ["amount"]


class InvoiceItemSerializer(serializers.ModelSerializer):
    taxes = InvoiceItemTaxSerializer(many=True, read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source="service",
    )

    class Meta:
        model = InvoiceItem
        fields = ["id", "service_id", "quantity", "unit_price", "subtotal", "taxes"]
        read_only_fields = ["subtotal", "taxes"]


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source="customer", write_only=True
    )
    customer = CustomerSimpleSerializer(read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "customer",
            "customer_id",
            "owner",
            "subtotal",
            "total_tax",
            "total",
            "created_at",
            "updated_at",
            "items",
            "invoice_number",
            "issue_date",
            "due_date",
        ]
        read_only_fields = [
            "owner",
            "subtotal",
            "total_tax",
            "total",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        invoice = Invoice.objects.create(**validated_data)

        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        invoice.update_totals()
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", [])

        # Update invoice fields
        instance = super().update(instance, validated_data)

        # Handle items - delete existing and create new ones
        instance.items.all().delete()
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=instance, **item_data)

        instance.update_totals()
        return instance
