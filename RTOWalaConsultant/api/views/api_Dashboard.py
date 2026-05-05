from datetime import timedelta
from django.db.models import Sum
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from api.models import Client, Vehicle, VehicleDocument
from .base import BaseViewSet

class DashboardViewSet(BaseViewSet):
    http_method_names = ['get']
    def list(self, request, *args, **kwargs):
        today = timezone.localdate(); month_end = today + timedelta(days=30)
        docs = VehicleDocument.objects.select_related('vehicle','vehicle__client','document_category')
        expiring = docs.filter(end_date__range=[today, month_end]).order_by('end_date')[:10]
        revenue = docs.filter(created_at__year=today.year, created_at__month=today.month).aggregate(total=Sum('amount'))['total'] or 0
        data = {
            'total_clients': Client.objects.filter(is_deleted=False).count(),
            'total_vehicles': Vehicle.objects.filter(is_deleted=False).count(),
            'active_insurance': docs.filter(document_category__name__iexact='Insurance', is_current=True, end_date__gte=today).count(),
            'monthly_revenue': revenue,
            'expiring_documents': [{
                'id': d.id, 'vehicle_number': d.vehicle.vehicle_number, 'client_name': d.vehicle.client.name,
                'doc_type': d.document_category.name, 'status': d.status, 'end_date': d.end_date
            } for d in expiring]
        }
        return self.success(data, 'Dashboard fetched successfully')
