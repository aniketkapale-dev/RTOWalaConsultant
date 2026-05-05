from django.contrib.auth.models import AbstractUser
from django.db import models
from .base import BaseModel
from .api_Role import UserRole

class User(AbstractUser, BaseModel):
    name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    role = models.ForeignKey(UserRole, on_delete=models.PROTECT, related_name='users')
    REQUIRED_FIELDS = ['name', 'mobile_number']

    def __str__(self):
        return self.username

    @property
    def role_name(self):
        return self.role.role_name if self.role else None
