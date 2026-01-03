from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BrandViewSet, VehicleModelViewSet

router = DefaultRouter()
router.register(r"brands", BrandViewSet)
router.register(r"vehicle-models", VehicleModelViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
