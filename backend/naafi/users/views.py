from django.db.models import Q
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User
from .permissions import IsUserOrCreatingAccountOrReadOnly
from .serializers import CreateUserSerializer, UserSerializer, UserTenantSerializer


class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """
    Updates and retrieves user accounts
    """

    serializer_class = UserSerializer
    permission_classes = (IsUserOrCreatingAccountOrReadOnly,)

    def get_queryset(self):
        user = self.request.user
        search_term = self.request.query_params.get("search", None)

        # Base queryset logic
        if user.is_staff or user.is_superuser:
            queryset = User.objects.all()
        elif hasattr(user, "tenant") and user.tenant:
            queryset = User.objects.filter(tenant=user.tenant)
        else:
            # No tenant, no admin → empty queryset, skip filtering
            return User.objects.none()

        # Apply search only if queryset is not empty
        if search_term and queryset.exists():
            queryset = queryset.filter(
                Q(email__icontains=search_term)  # Example: search by username
                | Q(full_name__icontains=search_term)
                # add more filters if needed
            )

        return queryset

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def signup(self, request):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def tenant(self, request):
        serializer = UserTenantSerializer(request.user)
        return Response(serializer.data)
