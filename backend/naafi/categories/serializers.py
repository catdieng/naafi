from rest_framework import serializers

from naafi.taxes.models import Tax
from naafi.taxes.serializers import TaxSerializer

from .models import Category


class ParentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")


class CategorySerializer(serializers.ModelSerializer):
    default_taxes = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tax.objects.all(), required=False
    )
    default_taxes_details = TaxSerializer(
        many=True, source="default_taxes", read_only=True
    )
    parent_category = ParentCategorySerializer(source="parent", read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "type",
            "parent",
            "owner",
            "parent_category",
            "default_taxes",
            "default_taxes_details",
            "created_at",
            "updated_at",
        ]
        read_only_fields = (
            "slug",
            "owner",
            "parent_category",
            "created_at",
            "updated_at",
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def validate_parent(self, value):
        if self.instance and value and self.instance.pk == value.pk:
            raise serializers.ValidationError("A category cannot be its own parent.")
        return value

    def create(self, validated_data):
        taxes_data = validated_data.pop("default_taxes", [])
        category = Category.objects.create(**validated_data)
        category.default_taxes.set(taxes_data)
        return category

    def update(self, instance, validated_data):
        taxes_data = validated_data.pop("default_taxes", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if taxes_data is not None:
            instance.default_taxes.set(taxes_data)
        return instance
