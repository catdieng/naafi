from django.contrib import admin
from django_tenants.admin import TenantAdminMixin

from .models import Tenant


@admin.register(Tenant)
class TenantAdmin(TenantAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'owner', 'paid_until', 'on_trial', 'created_on')
    search_fields = ('name', 'owner__email')
    list_filter = ('on_trial', 'paid_until')
