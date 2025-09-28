from rest_framework import serializers

from .constants import ALLOWED_SETTINGS
from .models import Setting


class SettingSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()

    class Meta:
        model = Setting
        fields = [
            "id",
            "domain",
            "key",
            "value",
            "type",
            "file",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "type"]

    def get_value(self, obj):
        request = self.context.get("request")
        if obj.file:
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return obj.cast_value

    def create(self, validated_data):
        value = self.initial_data.get("value")
        validated_data = self._map_value_field(validated_data, value)
        setting = Setting(**validated_data)
        setting.full_clean()
        setting.save()
        return setting

    def update(self, instance, validated_data):
        value = self.initial_data.get("value")
        validated_data = self._map_value_field(validated_data, value)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.full_clean()
        instance.save()
        return instance

    def _map_value_field(self, data, value):
        domain = data.get("domain")
        key = data.get("key")
        allowed = ALLOWED_SETTINGS.get(domain, {}).get(key)
        if not allowed:
            raise serializers.ValidationError(
                f"Invalid key '{key}' for domain '{domain}'"
            )

        # Determine type automatically
        t = allowed["type"] if isinstance(allowed, dict) else allowed
        data["type"] = t

        # Map to appropriate field
        if t in ["int", "bool", "str"]:
            data["value_str"] = str(value) if value is not None else None
            data["value_json"] = None
        elif t == "json":
            data["value_json"] = value
            data["value_str"] = None
        return data
