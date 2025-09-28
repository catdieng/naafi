from rest_framework import permissions, viewsets

from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = (
        Appointment.objects.all()
        .select_related("customer", "owner")
        .prefetch_related("services")
    )
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # automatically set owner to the logged-in user
        serializer.save(
            owner=self.request.user
        )  # automatically set owner to the logged-in user
        serializer.save(owner=self.request.user)
