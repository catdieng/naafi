from naafi.customers.serializers import CustomerSerializer
from naafi.services.models import Service
from naafi.services.serializers import ServiceSerializer
from naafi.vehicles.serializers import VehicleSerializer
from rest_framework import serializers

from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    start = serializers.DateTimeField(format="%Y-%m-%dT%H:%M", required=False)
    end = serializers.DateTimeField(format="%Y-%m-%dT%H:%M", required=False)
    duration = serializers.SerializerMethodField()
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.customer.field.related_model.objects.all(),
        source="customer",
        required=False,
        allow_null=True,
    )
    vehicle = VehicleSerializer(read_only=True)
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.vehicle.field.related_model.objects.all(),
        source="vehicle",
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
    status = serializers.ChoiceField(
        choices=Appointment._meta.get_field("status").choices, required=False
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "customer",
            "customer_id",
            "vehicle",
            "vehicle_id",
            "start",
            "end",
            "status",
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

    def create(self, validated_data):
        # Extract services from validated data
        services = validated_data.pop("services_ids", [])
        appointment = Appointment.objects.create(**validated_data)

        # Assign the many-to-many relationship
        if services:
            appointment.services.set(services)

        return appointment

    def update(self, instance, validated_data):
        # Handle services update properly
        services = validated_data.pop("services_ids", None)
        instance = super().update(instance, validated_data)

        if services is not None:
            instance.services.set(services)

        return instance

    def get_duration(self, obj):
        if obj.duration:
            return int(obj.duration.total_seconds() // 60)  # in minutes
        return None

    def validate(self, data):
        is_create = self.instance is None

        start = (
            data.get("start")
            if is_create
            else data.get("start", getattr(self.instance, "start", None))
        )
        end = (
            data.get("end")
            if is_create
            else data.get("end", getattr(self.instance, "end", None))
        )

        if is_create:
            if not start or not end:
                raise serializers.ValidationError({
                    "start": "This field is required.",
                    "end": "This field is required.",
                })

        if start and end and end <= start:
            raise serializers.ValidationError({
                "end": "End time must be after start time."
            })

        return data
