from django.utils.dateparse import parse_datetime
from rest_framework import permissions, viewsets

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = (
            Appointment.objects.all()
            .select_related("customer", "owner")
            .prefetch_related("services")
        )

        # Get query params
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")

        # Filter by start and end if provided
        if start:
            start_dt = parse_datetime(start)
            if start_dt:
                queryset = queryset.filter(start__gte=start_dt)

        if end:
            end_dt = parse_datetime(end)
            if end_dt:
                queryset = queryset.filter(end__lte=end_dt)

        return queryset

    def perform_create(self, serializer):
        # automatically set owner to the logged-in user
        serializer.save(owner=self.request.user)
