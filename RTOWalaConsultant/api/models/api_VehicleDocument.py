from django.db import models
from .base import BaseModel
from .api_User import User
from .api_Vehicle import Vehicle
from .api_VehicleDocumentCategory import VehicleDocumentCategory

class VehicleDocument(BaseModel):
    STATUS_CHOICES = (('active','active'),('expiring','expiring'),('expired','expired'),('renewed','renewed'))
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='documents')
    document_category = models.ForeignKey(VehicleDocumentCategory, on_delete=models.PROTECT, related_name='documents')
    document_number = models.CharField(max_length=100, blank=True, null=True)
    issue_date = models.DateField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    provider = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    file_path = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_current = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='created_documents')

    def __str__(self):
        return f'{self.vehicle.vehicle_number} - {self.document_category.name}'
