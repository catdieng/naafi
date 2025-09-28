from django.urls import path

from .views import SettingsByDomainView, SettingUpdateView

urlpatterns = [
    path("<str:domain>/", SettingsByDomainView.as_view(), name="settings_by_domain"),
    path("<str:domain>/<str:key>/", SettingUpdateView.as_view(), name="setting_update"),
]
