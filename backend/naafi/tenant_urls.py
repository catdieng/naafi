from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Naafi API",
        default_version="v1",
        description="Just another SaaS API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="tehneophyt@gmail.com"),
        license=openapi.License(name="No License"),
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns = [
    path(
        "swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # Tenant apps urls
    path("api/v1/items/", include("naafi.services.urls")),
    path("api/v1/categories/", include("naafi.categories.urls")),
    path("api/v1/expenses/", include("naafi.expenses.urls")),
    path("api/v1/customers/", include("naafi.customers.urls")),
    path("api/v1/users/", include("naafi.users.urls")),
    path("api/v1/taxes/", include("naafi.taxes.urls")),
    path("api/v1/invoices/", include("naafi.invoices.urls")),
    path("api/v1/appointments/", include("naafi.appointments.urls")),
    path("api/v1/settings/", include("naafi.settings.urls")),
]
