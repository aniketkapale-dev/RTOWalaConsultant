from api.models import User
from api.serializers import UserSerializer
from .base import BaseViewSet

class UserViewSet(BaseViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer
