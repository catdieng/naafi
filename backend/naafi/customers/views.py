from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from naafi.utils.pagination import CustomPageNumberPagination

from .models import Customer
from .serializers import CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = CustomPageNumberPagination

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        queryset = Customer.objects.all().order_by("-created_at")
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search)
                | Q(phone__icontains=search)
                | Q(email__icontains=search)
                | Q(address__icontains=search)
            )

        return queryset

    @action(detail=False, methods=["get"])
    def search(self, request):
        queryset = Customer.objects.all()
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search)
                | Q(phone__icontains=search)
                | Q(email__icontains=search)
                | Q(address__icontains=search)
            )

        serializer = CustomerSerializer(queryset, many=True)

        return Response({"results": serializer.data}, status=status.HTTP_200_OK)
