from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from naafi.taxes.models import Tax
from naafi.taxes.serializers import TaxSerializer


class TaxViewSet(viewsets.ModelViewSet):
    serializer_class = TaxSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Tax.objects.all()
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=["get"])
    def all(self, request):
        queryset = Tax.objects.all()
        serializer = TaxSerializer(queryset, many=True)
        return Response({"results": serializer.data}, status=status.HTTP_200_OK)
