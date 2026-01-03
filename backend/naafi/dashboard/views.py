from datetime import timedelta
from django.db.models import Sum
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from naafi.appointments.models import Appointment, AppointmentStatus
from naafi.customers.models import Customer
from naafi.expenses.models import Expense
from naafi.invoices.models import Invoice

from .serializers import KPISerializer


def safe_aggregate(queryset, field_name, default=0):
    """Safely get aggregate sum, returning default if no records or None."""
    result = queryset.aggregate(total=Sum(field_name))
    value = result.get("total")
    return value if value is not None else default


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kpis(request):
    """
    Calculate and return KPIs for the authenticated user.
    """
    user = request.user
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = today_start.replace(day=1)
    
    # Revenue from invoices
    invoices = Invoice.objects.filter(owner=user)
    revenue_this_month = safe_aggregate(
        invoices.filter(created_at__gte=month_start), "total"
    )
    
    # Expenses
    expenses = Expense.objects.filter(owner=user)
    expenses_this_month = safe_aggregate(
        expenses.filter(date__gte=month_start.date()), "amount"
    )
    
    # Profit calculation
    profit_this_month = revenue_this_month - expenses_this_month
    
    # Customer metrics - count all customers in tenant (not just owned by user)
    customers = Customer.objects.all()
    total_customers = customers.count()
    
    # Appointment metrics - count all appointments in tenant
    appointments = Appointment.objects.all()
    appointments_today = appointments.filter(
        start__date=today_start.date()
    ).count()
    
    # Overdue invoices (invoices with due_date in the past and not paid)
    overdue_invoices_qs = invoices.filter(
        due_date__lt=today_start.date(),
        due_date__isnull=False
    )
    overdue_invoices_count = overdue_invoices_qs.count()
    overdue_invoices_total = safe_aggregate(overdue_invoices_qs, "total")
    
    # Get all appointments for today (no owner restriction, show all in tenant)
    upcoming_appointments_qs = (
        appointments.filter(start__date=today_start.date())
        .exclude(status=AppointmentStatus.CANCELLED)
        .select_related("customer", "vehicle")
        .order_by("start")[:5]
    )
    
    upcoming_appointments = [
        {
            "id": apt.id,
            "start": apt.start,
            "end": apt.end,
            "status": apt.status,
            "description": apt.description or "",
            "customer_name": apt.customer.full_name if apt.customer else None,
            "vehicle_plate": apt.vehicle.license_plate if apt.vehicle else None,
        }
        for apt in upcoming_appointments_qs
    ]
    
    # Get appointments starting in the next 2 hours (alerts)
    two_hours_from_now = now + timedelta(hours=2)
    upcoming_soon_qs = (
        appointments.filter(
            start__gte=now,
            start__lte=two_hours_from_now
        )
        .exclude(status__in=[AppointmentStatus.CANCELLED, AppointmentStatus.DONE])
        .select_related("customer", "vehicle")
        .order_by("start")[:5]
    )
    
    upcoming_appointments_soon = [
        {
            "id": apt.id,
            "start": apt.start,
            "end": apt.end,
            "status": apt.status,
            "description": apt.description or "",
            "customer_name": apt.customer.full_name if apt.customer else None,
            "vehicle_plate": apt.vehicle.license_plate if apt.vehicle else None,
        }
        for apt in upcoming_soon_qs
    ]
    
    # Revenue trend for last 7 days
    revenue_trend = []
    for i in range(7):
        day_start = today_start - timedelta(days=6 - i)
        day_end = day_start + timedelta(days=1)
        day_revenue = safe_aggregate(
            invoices.filter(created_at__gte=day_start, created_at__lt=day_end),
            "total"
        )
        revenue_trend.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "day": day_start.strftime("%a"),  # Mon, Tue, etc.
            "revenue": str(day_revenue),
        })
    
    kpi_data = {
        "revenue_this_month": revenue_this_month,
        "profit_this_month": profit_this_month,
        "total_customers": total_customers,
        "appointments_today": appointments_today,
        "upcoming_appointments": upcoming_appointments,
        "upcoming_appointments_soon": upcoming_appointments_soon,
        "overdue_invoices_count": overdue_invoices_count,
        "overdue_invoices_total": overdue_invoices_total,
        "revenue_trend": revenue_trend,
    }
    
    serializer = KPISerializer(kpi_data)
    return Response(serializer.data)

