from drf_spectacular.utils import extend_schema, extend_schema_view
from api.models import Vehicle
from api.serializers import VehicleSerializer
from .base import BaseViewSet

@extend_schema_view(
    list=extend_schema(tags=['Vehicles']), retrieve=extend_schema(tags=['Vehicles']), create=extend_schema(tags=['Vehicles']),
    update=extend_schema(tags=['Vehicles']), partial_update=extend_schema(tags=['Vehicles']), destroy=extend_schema(tags=['Vehicles'])
)
class VehicleViewSet(BaseViewSet):
    serializer_class = VehicleSerializer

    def get_queryset(self):
        qs = Vehicle.objects.select_related('client').filter(is_deleted=False).order_by('-id')
        client_id = self.request.query_params.get('client')
        if client_id:
            qs = qs.filter(client_id=client_id)
        return qs
