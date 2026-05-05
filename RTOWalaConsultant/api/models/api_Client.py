from django.db import models
from .base import BaseModel

class Client(BaseModel):
    name = models.CharField(max_length=150)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'{self.name} - {self.mobile_number}'
