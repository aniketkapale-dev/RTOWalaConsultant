from django.db import models
from .base import BaseModel
from .api_Client import Client

class Vehicle(BaseModel):
    VEHICLE_TYPES = (('Bike','Bike'),('Car','Car'),('Truck','Truck'),('Bus','Bus'),('Auto','Auto'),('Other','Other'))
    FUEL_TYPES = (('Petrol','Petrol'),('Diesel','Diesel'),('CNG','CNG'),('Electric','Electric'),('Hybrid','Hybrid'),('Other','Other'))
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='vehicles')
    vehicle_number = models.CharField(max_length=20, unique=True)
    vehicle_name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=50, choices=VEHICLE_TYPES, blank=True, null=True)
    fuel_type = models.CharField(max_length=50, choices=FUEL_TYPES, blank=True, null=True)

    def __str__(self):
        return self.vehicle_number
