from rest_framework import serializers


class AppointmentSimpleSerializer(serializers.Serializer):
    """Simplified appointment serializer for dashboard agenda."""
    id = serializers.IntegerField()
    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
    status = serializers.CharField()
    description = serializers.CharField(allow_null=True, allow_blank=True)
    customer_name = serializers.CharField(allow_null=True)
    vehicle_plate = serializers.CharField(allow_null=True)


class KPISerializer(serializers.Serializer):
    # Revenue metrics
    revenue_this_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    
    # Profit metrics
    profit_this_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    
    # Customer metrics
    total_customers = serializers.IntegerField()
    
    # Appointment metrics
    appointments_today = serializers.IntegerField()
    
    # Upcoming appointments
    upcoming_appointments = AppointmentSimpleSerializer(many=True)
    
    # Alerts
    upcoming_appointments_soon = AppointmentSimpleSerializer(many=True, required=False, allow_empty=True)
    overdue_invoices_count = serializers.IntegerField(required=False)
    overdue_invoices_total = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    
    # Revenue trend (last 7 days)
    revenue_trend = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
            allow_empty=True
        ),
        required=False,
        allow_empty=True
    )

