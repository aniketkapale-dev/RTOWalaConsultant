from rest_framework import serializers
from api.models import ErrorLogs
class ErrorLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrorLogs
        fields = '__all__'
