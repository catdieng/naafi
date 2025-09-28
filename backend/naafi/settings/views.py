from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .constants import ALLOWED_SETTINGS
from .models import Setting
from .serializers import SettingSerializer


class SettingsByDomainView(generics.ListAPIView):
    def get(self, request, domain):
        # Check if domain is allowed
        if domain not in ALLOWED_SETTINGS:
            return Response(
                {"detail": f"Invalid domain '{domain}'."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Fetch all saved settings for this domain
        settings = Setting.objects.filter(domain=domain)
        saved_values = {s.key: s.cast_value for s in settings}

        # Merge with ALLOWED_SETTINGS to include all keys, set None if not saved
        result = {}
        for key, definition in ALLOWED_SETTINGS[domain].items():
            if isinstance(definition, dict) and definition.get("type") == "json":
                result[key] = saved_values.get(
                    key, {}
                )  # JSON fields default to empty dict
            else:
                result[key] = saved_values.get(key, None)

        return Response(result)


class SettingUpdateView(generics.GenericAPIView):
    serializer_class = SettingSerializer

    def get_object(self):
        domain = self.kwargs.get("domain")
        key = self.kwargs.get("key")
        try:
            return Setting.objects.get(domain=domain, key=key)
        except Setting.DoesNotExist:
            return None

    def post(self, request, domain, key):
        instance = self.get_object()
        data = request.data.copy()
        data["domain"] = domain
        data["key"] = key

        # File handling
        if "file" in request.FILES:
            data["file"] = request.FILES["file"]
        else:
            data["file"] = None

        # Must provide either value or file
        if "value" not in data and "file" not in data:
            raise ValidationError({
                "non_field_errors": "Either 'value' or 'file' must be provided."
            })

        if instance:
            serializer = self.get_serializer(
                instance, data=data, partial=True, context={"request": request}
            )
        else:
            serializer = self.get_serializer(data=data, context={"request": request})

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
