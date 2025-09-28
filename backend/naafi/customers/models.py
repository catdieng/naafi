from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Customer(models.Model):
    full_name = models.CharField(max_length=100, blank=False, null=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="customers"
    )
