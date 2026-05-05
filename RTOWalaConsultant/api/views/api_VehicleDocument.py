from datetime import timedelta
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view
from api.models import VehicleDocument
from api.serializers import VehicleDocumentSerializer
from .base import BaseViewSet

@extend_schema_view(
    list=extend_schema(tags=['Vehicle Documents']), retrieve=extend_schema(tags=['Vehicle Documents']), create=extend_schema(tags=['Vehicle Documents']),
    update=extend_schema(tags=['Vehicle Documents']), partial_update=extend_schema(tags=['Vehicle Documents']), destroy=extend_schema(tags=['Vehicle Documents'])
)
class VehicleDocumentViewSet(BaseViewSet):
    serializer_class = VehicleDocumentSerializer

    def get_queryset(self):
        qs = VehicleDocument.objects.select_related('vehicle','vehicle__client','document_category').filter(is_deleted=False).order_by('end_date','-id')
        category = self.request.query_params.get('category')
        current_month = self.request.query_params.get('current_month')
        client_id = self.request.query_params.get('client')
        vehicle_id = self.request.query_params.get('vehicle')
        current = self.request.query_params.get('current')
        if category:
            qs = qs.filter(document_category__name__iexact=category)
        if client_id:
            qs = qs.filter(vehicle__client_id=client_id)
        if vehicle_id:
            qs = qs.filter(vehicle_id=vehicle_id)
        if current in ['true', '1']:
            qs = qs.filter(is_current=True)
        if current_month == 'true':
            today = timezone.localdate(); end = today + timedelta(days=30)
            qs = qs.filter(end_date__range=[today, end])
        return qs

    def perform_create(self, serializer):
        vehicle = serializer.validated_data.get('vehicle')
        category = serializer.validated_data.get('document_category')
        if vehicle and category:
            VehicleDocument.objects.filter(vehicle=vehicle, document_category=category, is_current=True).update(is_current=False, status='renewed')
        serializer.save(created_by=self.request.user, is_current=True)
