from rest_framework import serializers
from api.models import Client
class ClientSerializer(serializers.ModelSerializer):
    total_vehicles = serializers.IntegerField(source='vehicles.count', read_only=True)
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['uniq_id','created_at','updated_at']
