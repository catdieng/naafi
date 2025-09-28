from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Invoice, InvoiceItem
from .serializers import InvoiceItemSerializer, InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own invoices
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the owner to the current user
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def add_item(self, request, pk=None):
        invoice = self.get_object()
        serializer = InvoiceItemSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save(invoice=invoice)
            item.calculate_taxes()
            invoice.update_totals()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["delete"])
    def remove_item(self, request, pk=None):
        invoice = self.get_object()
        item_id = request.data.get("item_id")
        try:
            item = invoice.items.get(id=item_id)
            item.delete()
            invoice.update_totals()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except InvoiceItem.DoesNotExist:
            return Response(
                {"error": "Item not found in this invoice"},
                status=status.HTTP_404_NOT_FOUND,
            )
