from django.db.models import Q
from rest_framework import viewsets

from naafi.utils.common import to_int
from naafi.utils.pagination import CustomPageNumberPagination

from .models import Brand, Vehicle, VehicleModel
from .serializers import BrandSerializer, VehicleModelSerializer, VehicleSerializer


class BrandViewSet(viewsets.ModelViewSet):
    serializer_class = BrandSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Brand.objects.filter(deleted__isnull=True)
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset


# class BrandViewSet(viewsets.ModelViewSet):
#     queryset = Brand.objects.all()
#     serializer_class = BrandSerializer
#     pagination_class = CustomPageNumberPagination

#     def get_queryset(self):
#         queryset = Brand.objects.all()
#         search = self.request.query_params.get("search", None)
#         if search:
#             queryset = queryset.filter(Q(name__icontains=search))
#         return queryset

#     @action(detail=False, methods=["get"])
#     def all(self, request):
#         queryset = Brand.objects.all()
#         serializer = BrandSerializer(queryset, many=True)
#         return Response({"results": serializer.data}, status=status.HTTP_200_OK)

#     @action(detail=False, methods=["get"])
#     def search(self, request):
#         queryset = Brand.objects.all()
#         search = self.request.query_params.get("search", None)
#         if search:
#             queryset = queryset.filter(Q(name__icontains=search))
#         serializer = BrandSerializer(queryset, many=True)
#         return Response({"results": serializer.data}, status=status.HTTP_200_OK)


class BrandVehicleModelViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleModelSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = VehicleModel.objects.filter(
            brand_id=self.kwargs["brand_pk"]
        ).select_related("brand")
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(Q(name__icontains=search))
        return queryset

    def perform_create(self, serializer):
        serializer.save(brand_id=self.kwargs["brand_pk"])


class CustomerVehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Vehicle.objects.filter(
            customer_id=self.kwargs["customer_pk"]
        ).select_related("model__brand")
        search = self.request.query_params.get("search", None)
        if search:
            filters = (
                Q(license_plate__icontains=search)
                | Q(vin__icontains=search)
                | Q(model__name__icontains=search)
                | Q(model__brand__name__icontains=search)
            )

            search_int = to_int(search)
            if search_int is not None:
                filters |= Q(year=search_int)

            queryset = queryset.filter(filters)

        return queryset

    def perform_create(self, serializer):
        serializer.save(customer_id=self.kwargs["customer_pk"])
