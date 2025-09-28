from rest_framework import serializers

from naafi.categories.models import Category
from naafi.taxes.models import Tax
from naafi.taxes.serializers import TaxSerializer
from naafi.users.serializers import UserSerializer

from .models import Service, ServiceCategory


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]


class ServiceSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )
    custom_taxes = serializers.PrimaryKeyRelatedField(
        queryset=Tax.objects.all(),
        many=True,
        required=False,
    )
    custom_taxes_details = TaxSerializer(
        many=True, source="custom_taxes", read_only=True
    )
    owner = UserSerializer(read_only=True)
    duration = serializers.DurationField(required=False, allow_null=True)
    applicable_taxes = serializers.SerializerMethodField()
    applicable_tax_ids = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "slug",
            "price",
            "duration",
            "description",
            "created_at",
            "updated_at",
            "category",
            "category_id",
            "custom_taxes",
            "custom_taxes_details",
            "owner",
            "is_active",
            "applicable_taxes",
            "applicable_tax_ids",
        ]
        read_only_fields = [
            "id",
            "slug",
            "created_at",
            "updated_at",
            "owner",
            "applicable_taxes",
            "applicable_tax_ids",
        ]
        extra_kwargs = {
            "name": {"trim_whitespace": True},
            "description": {"trim_whitespace": True},
        }

    def get_applicable_taxes(self, obj):
        taxes = obj.get_applicable_taxes()
        return TaxSerializer(taxes, many=True).data

    def get_applicable_tax_ids(self, obj):
        taxes = obj.get_applicable_taxes()
        return [tax.id for tax in taxes]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)
