from api.models import UserRole
from api.serializers import RoleSerializer
from .base import BaseViewSet

class RoleViewSet(BaseViewSet):
    queryset = UserRole.objects.all().order_by('-id')
    serializer_class = RoleSerializer
