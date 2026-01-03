from rest_framework import serializers

from .models import Brand, Vehicle, VehicleModel


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = [
            "id",
            "name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class VehicleModelSerializer(serializers.ModelSerializer):
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all())
    brand_name = serializers.ReadOnlyField(source="brand.name")

    class Meta:
        model = VehicleModel
        fields = [
            "id",
            "name",
            "brand",
            "brand_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class VehicleSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source="customer.name")
    brand = serializers.SerializerMethodField()
    brand_name = serializers.SerializerMethodField()
    model_name = serializers.ReadOnlyField(source="model.name")

    class Meta:
        model = Vehicle
        fields = [
            "id",
            "customer",
            "customer_name",
            "brand",
            "brand_name",
            "model",
            "model_name",
            "license_plate",
            "vin",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "brand", "brand_name"]

    def get_brand(self, obj):
        return obj.model.brand_id if obj.model else None

    def get_brand_name(self, obj):
        return obj.model.brand.name if obj.model else None
