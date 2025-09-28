from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from naafi.expenses.serializers import ExpenseCategorySerializer, ExpenseSerializer

from .models import Expense, ExpenseCategory


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Expense.objects.all()
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(amount__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        # Automatically set the owner to the current user
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_as_paid(self, request, pk=None):
        expense = self.get_object()
        expense.paid = True
        expense.save()
        return Response({"status": "marked as paid"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def categories(self, request):
        # List of all categories of expense
        categories_queryset = ExpenseCategory.objects.all()

        serializer = ExpenseCategorySerializer(categories_queryset, many=True)

        return Response({"results": serializer.data}, status=status.HTTP_200_OK)
