from django.contrib import admin
from api.models import UserRole, User, Client, Vehicle, VehicleDocumentCategory, VehicleDocument, ErrorLogs
for model in [UserRole, User, Client, Vehicle, VehicleDocumentCategory, VehicleDocument, ErrorLogs]:
    admin.site.register(model)
