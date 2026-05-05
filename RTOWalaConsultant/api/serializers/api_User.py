from rest_framework import serializers
from api.models import User
class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        fields = ['id','uniq_id','username','name','mobile_number','email','address','role','role_name','password','is_active','is_deleted','created_at','updated_at']
        read_only_fields = ['uniq_id','created_at','updated_at']
    def create(self, validated_data):
        password = validated_data.pop('password', None) or 'User@12345'
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for k,v in validated_data.items(): setattr(instance,k,v)
        if password: instance.set_password(password)
        instance.save(); return instance
