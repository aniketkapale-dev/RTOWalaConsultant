from rest_framework import serializers
from api.models import Vehicle
class VehicleSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ['uniq_id','created_at','updated_at']
