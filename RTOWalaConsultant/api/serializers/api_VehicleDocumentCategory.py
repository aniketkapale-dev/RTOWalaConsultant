from rest_framework import serializers
from api.models import VehicleDocumentCategory
class VehicleDocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleDocumentCategory
        fields = '__all__'
