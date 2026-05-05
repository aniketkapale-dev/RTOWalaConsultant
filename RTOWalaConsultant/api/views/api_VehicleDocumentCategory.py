from api.models import VehicleDocumentCategory
from api.serializers import VehicleDocumentCategorySerializer
from .base import BaseViewSet

class VehicleDocumentCategoryViewSet(BaseViewSet):
    queryset = VehicleDocumentCategory.objects.all().order_by('-id')
    serializer_class = VehicleDocumentCategorySerializer
