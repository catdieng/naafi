from django.utils.text import slugify
from rest_framework import serializers

from .models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = "__all__"


class TenantCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = (
            "name",
            "description",
            "industry",
            "zip_code",
            "phone_number",
            "email",
            "full_name",
            "address",
            "logo",
            "country",
        )
        extra_kwargs = {
            "schema_name": {"read_only": True},
            "slug": {"read_only": True},
        }

    def validate(self, attrs):
        name = attrs.get("name", "")
        # Convert to slug, then replace `-` with `_` to make it PostgreSQL-safe
        schema_name = slugify(name).replace("-", "_")
        attrs["schema_name"] = schema_name
        return attrs
