from rest_framework import serializers

from naafi.users.serializers import UserSerializer

from .models import Expense, ExpenseCategory


class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ExpenseCategory.objects.all(),  # filtered by manager
        source="category",
        allow_null=True,
        required=False,
    )
    category = ExpenseCategorySerializer(read_only=True)

    class Meta:
        model = Expense
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at", "owner")
