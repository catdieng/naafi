from rest_framework import serializers

from naafi.customers.serializers import CustomerSerializer
from naafi.services.models import Service
from naafi.services.serializers import ServiceSerializer

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    start = serializers.DateTimeField(format="%Y-%m-%dT%H:%M")
    end = serializers.DateTimeField(format="%Y-%m-%dT%H:%M")
    duration = serializers.SerializerMethodField()
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.customer.field.related_model.objects.all(),
        source="customer",
        required=False,
        allow_null=True,
    )
    services_ids = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "customer",
            "customer_id",
            "start",
            "end",
            "description",
            "services",
            "services_ids",
            "owner",
            "created_at",
            "updated_at",
            "duration",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
            "duration",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Require customer_id only on creation
        if self.instance is None:  # creation
            self.fields["customer_id"].required = True

    def get_duration(self, obj):
        if obj.duration:
            return int(obj.duration.total_seconds() // 60)  # in minutes
        return None

    def validate(self, data):
        start = data.get("start")
        end = data.get("end")
        if start and end and end <= start:
            raise serializers.ValidationError("End time must be after start time.")

        return data
        return data
