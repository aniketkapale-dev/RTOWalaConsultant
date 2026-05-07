from rest_framework import filters

from api.models import Client
from api.serializers import ClientSerializer
from .base import BaseViewSet

class ClientViewSet(BaseViewSet):
    serializer_class = ClientSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'mobile_number']

    def get_queryset(self):
        return Client.objects.prefetch_related('vehicles').filter(is_deleted=False).order_by('-id')
