from api.models import Client
from api.serializers import ClientSerializer
from .base import BaseViewSet

class ClientViewSet(BaseViewSet):
    queryset = Client.objects.all().order_by('-id')
    serializer_class = ClientSerializer
