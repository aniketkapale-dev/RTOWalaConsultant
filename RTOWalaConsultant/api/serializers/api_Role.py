from rest_framework import serializers
from api.models import UserRole
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = '__all__'
