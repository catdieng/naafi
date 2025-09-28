from django.conf import settings
from django.db import connection
from django.http import Http404, JsonResponse
from django.urls import set_urlconf
from django.utils.deprecation import MiddlewareMixin
from django_tenants.utils import get_tenant_model
from rest_framework.authtoken.models import Token

from naafi.common.helpers.logger import logger


class UserTenantMiddleware(MiddlewareMixin):
    """
    Middleware that handles:
    1. Token authentication from Authorization header
    2. Tenant schema selection based on authenticated user
    3. Fallback to public schema when needed
    """

    TENANT_NOT_FOUND_EXCEPTION = Http404
    PUBLIC_SCHEMA_NAME = getattr(settings, "PUBLIC_SCHEMA_NAME", "public")

    def process_request(self, request):
        """
        Process the request before it reaches the view:
        1. Authenticate via token if present
        2. Set tenant schema based on authenticated user
        """
        # Always start with public schema
        self._set_public_schema()

        # Skip tenant logic for certain paths
        if self._should_skip_tenant_logic(request.path):
            return None

        # Authenticate user from token if present
        self._authenticate_from_token(request)

        user = getattr(request, "user", None)
        auth = getattr(request, "auth", None)
        logger.info(f"UserTenantMiddleware - User: {user}, Auth: {auth}")

        try:
            if user and user.is_authenticated:
                logger.info(
                    f"Authenticated User: {user}, Auth: {auth}, Path: {request.path}"
                )

                if "/users/" in request.path:
                    self._configure_public(request)
                    return None

                tenant = self._get_user_tenant(user)

                if tenant:
                    self._configure_tenant(request, tenant)
                    return None

                # Optional: uncomment to require tenants for authenticated users
                # return JsonResponse(
                #     {'error': 'No tenant assigned to user'},
                #     status=403
                # )

            # Fallback to public schema
            self._configure_public(request)

        except Exception as e:
            logger.error(f"Tenant middleware error: {str(e)}", exc_info=True)
            return JsonResponse({"error": "Tenant configuration error"}, status=500)

    def _authenticate_from_token(self, request):
        """Authenticate user from Authorization header if present"""
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Token "):
            token_key = auth_header.split(" ")[1]
            try:
                token = Token.objects.get(key=token_key)
                request.user = token.user
                request.auth = token
                logger.debug(f"Authenticated user {token.user} from token")
            except Token.DoesNotExist:
                logger.debug(f"Invalid token: {token_key}")
                # Don't fail here - may have other auth methods

    def _should_skip_tenant_logic(self, path):
        """Check if the path should bypass tenant logic"""
        skip_paths = getattr(settings, "TENANT_BYPASS_PATHS", [])
        return any(path.startswith(skip_path) for skip_path in skip_paths)

    def _get_user_tenant(self, user):
        """Get the tenant associated with the user"""
        tenant_attrs = ["owned_tenant", "tenant", "active_tenant"]
        for attr in tenant_attrs:
            tenant = getattr(user, attr, None)
            if tenant:
                return tenant
        return None

    def _configure_tenant(self, request, tenant):
        """Configure request for tenant-specific processing"""
        request.tenant = tenant
        connection.set_schema(tenant.schema_name)

        tenant_urlconf = getattr(settings, "TENANT_SCHEMA_URLCONF", None)
        if tenant_urlconf:
            request.urlconf = tenant_urlconf
            set_urlconf(tenant_urlconf)

        logger.info(
            f"Configured tenant schema: {tenant.schema_name} for user {request.user}"
        )

    def _configure_public(self, request):
        """Configure request for public schema processing"""
        request.tenant = get_tenant_model()(
            schema_name=self.PUBLIC_SCHEMA_NAME, name="public"
        )
        connection.set_schema(self.PUBLIC_SCHEMA_NAME)

        public_urlconf = getattr(settings, "PUBLIC_SCHEMA_URLCONF", None)
        if public_urlconf:
            request.urlconf = public_urlconf
            set_urlconf(public_urlconf)

        logger.debug("Configured public schema")

    def _set_public_schema(self):
        """Utility method to set schema to public"""
        connection.set_schema(self.PUBLIC_SCHEMA_NAME)

    def process_response(self, request, response):
        """Reset schema to public after request processing"""
        self._set_public_schema()
        return response
