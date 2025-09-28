from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from naafi.utils.pagination import CustomPageNumberPagination

from .models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Category.objects.all()
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(Q(name__icontains=search))
        return queryset

    def perform_create(self, serializer):
        try:
            serializer.save(owner=self.request.user)
        except Exception as e:
            raise DRFValidationError(str(e))

    def perform_update(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise DRFValidationError(str(e))

    @action(detail=False, methods=["get"])
    def all(self, request):
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response({"results": serializer.data}, status=status.HTTP_200_OK)
