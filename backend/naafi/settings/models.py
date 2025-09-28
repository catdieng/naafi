from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import JSONField

from .constants import ALLOWED_SETTINGS


class Setting(models.Model):
    DOMAIN_CHOICES = [(k, k.capitalize()) for k in ALLOWED_SETTINGS.keys()]

    TYPE_CHOICES = [
        ("str", "String"),
        ("int", "Integer"),
        ("bool", "Boolean"),
        ("json", "JSON"),
    ]

    domain = models.CharField(max_length=30, choices=DOMAIN_CHOICES)
    key = models.CharField(max_length=30)
    value_str = models.TextField(null=True, blank=True)
    value_json = JSONField(null=True, blank=True)
    file = models.ImageField(upload_to="settings/", null=True, blank=True)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("domain", "key")

    def clean(self):
        # Validate domain/key
        allowed = ALLOWED_SETTINGS.get(self.domain, {}).get(self.key)
        if not allowed:
            raise ValidationError(
                f"Invalid key '{self.key}' for domain '{self.domain}'"
            )

        # Determine type
        expected_type = allowed["type"] if isinstance(allowed, dict) else allowed
        self.type = expected_type

        # Validate value
        if expected_type == "int":
            if self.value_str is None:
                raise ValidationError({"value_str": "This field is required."})
            try:
                int(self.value_str)
            except ValueError:
                raise ValidationError({"value_str": "Must be an integer."})
        elif expected_type == "bool":
            if str(self.value_str).lower() not in ["true", "false", "1", "0"]:
                raise ValidationError({"value_str": "Must be a boolean."})
        elif expected_type == "json":
            if self.value_json is None:
                raise ValidationError({"value_json": "This field is required."})
            allowed_keys = allowed.get("allowed_keys", [])
            for k in self.value_json.keys():
                if k not in allowed_keys:
                    raise ValidationError({
                        "value_json": f"Invalid key '{k}'. Allowed keys: {allowed_keys}"
                    })

    @property
    def cast_value(self):
        if self.type == "int":
            return int(self.value_str)
        elif self.type == "bool":
            return str(self.value_str).lower() in ["true", "1"]
        elif self.type == "json":
            return self.value_json
        return self.value_str
