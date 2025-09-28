from django.urls import path

from .views import create_tenant, get_tenant, get_tenant_by_name, get_tenants

urlpatterns = [
    path("", create_tenant, name="create_tenant"),
    path("<str:slug>/", get_tenant, name="get_tenant"),
    path(
        "get-by-name/<str:name>/",
        get_tenant_by_name,
        name="get_tenant_by_name",
    ),
    path("get-all/", get_tenants, name="get_tenants"),
]
