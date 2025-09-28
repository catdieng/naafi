from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Service, ServiceCategory
from .serializers import ServiceCategorySerializer, ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        queryset = Service.objects.all()
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(price__icontains=search)
                | Q(duration__icontains=search)
            )
        return queryset

    @action(detail=False, methods=["get"])
    def all(self, request):
        queryset = Service.objects.all()
        serializer = ServiceSerializer(queryset, many=True)
        return Response({"results": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def categories(self, request):
        categories_query = ServiceCategory.objects.all()
        serializer = ServiceCategorySerializer(categories_query, many=True)
        return Response({"results": serializer.data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def search(self, request):
        queryset = Service.objects.all()
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(price__icontains=search)
                | Q(duration__icontains=search)
            )
        serializer = ServiceSerializer(queryset, many=True)

        return Response({"results": serializer.data}, status=status.HTTP_200_OK)
