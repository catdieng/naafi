from rest_framework import serializers

from naafi.taxes.models import Tax


class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = "__all__"
        read_only_fields = ("owner", "created_at", "updated_at")
