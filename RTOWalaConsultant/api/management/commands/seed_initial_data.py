import os
from django.core.management.base import BaseCommand
from api.models import UserRole, User, VehicleDocumentCategory

class Command(BaseCommand):
    help = 'Create Admin/Staff roles, default admin user, and default document categories.'
    def handle(self, *args, **kwargs):
        admin_role, _ = UserRole.objects.get_or_create(role_name='Admin')
        staff_role, _ = UserRole.objects.get_or_create(role_name='Staff')
        for name in ['Insurance', 'PUC', 'Fitness Cert', 'Permit', 'RC', 'Other']:
            VehicleDocumentCategory.objects.get_or_create(name=name)
        username = os.getenv('ADMIN_USERNAME', 'admin')
        password = os.getenv('ADMIN_PASSWORD', 'Admin@12345')
        email = os.getenv('ADMIN_EMAIL', 'admin@rtowala.local')
        mobile = os.getenv('ADMIN_MOBILE', '9999999999')
        user, created = User.objects.get_or_create(username=username, defaults={'name':'Admin','email':email,'mobile_number':mobile,'role':admin_role,'is_staff':True,'is_superuser':True})
        if created:
            user.set_password(password); user.save()
        self.stdout.write(self.style.SUCCESS('Seed completed'))
        self.stdout.write(f'Admin username: {username}')
        self.stdout.write(f'Admin password: {password}')
