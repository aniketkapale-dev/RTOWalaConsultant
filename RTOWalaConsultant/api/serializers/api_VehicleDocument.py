from rest_framework import serializers
from api.models import VehicleDocument
class VehicleDocumentSerializer(serializers.ModelSerializer):
    vehicle_number = serializers.CharField(source='vehicle.vehicle_number', read_only=True)
    client_name = serializers.CharField(source='vehicle.client.name', read_only=True)
    document_category_name = serializers.CharField(source='document_category.name', read_only=True)
    class Meta:
        model = VehicleDocument
        fields = '__all__'
        read_only_fields = ['uniq_id','created_at','updated_at','created_by']
