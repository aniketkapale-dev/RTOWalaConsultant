from api.models import ErrorLogs
from api.serializers import ErrorLogSerializer
from .base import BaseViewSet

class ErrorLogViewSet(BaseViewSet):
    queryset = ErrorLogs.objects.all().order_by('-id')
    serializer_class = ErrorLogSerializer
