from django.utils.text import slugify
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Tenant
from .serializers import TenantCreateSerializer


@api_view(["GET"])
def get_tenant_by_name(request, name):
    try:
        Tenant.objects.get(name=name, slug=slugify(name))
    except Tenant.DoesNotExist:
        return Response({"status": "OK"}, status=status.HTTP_200_OK)

    return Response({"status": "NOT_OK"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_tenants(request):
    return Response({"message": "Hello, world!"})


@api_view(["POST"])
def create_tenant(request):
    """Create a new oganization and link it to the current user"""
    serializer = TenantCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = request.user
        user.tenant = serializer.instance
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_tenant(request):
    return Response({"message": "Hello, world!"})
