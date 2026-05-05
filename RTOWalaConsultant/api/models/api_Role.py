from django.db import models

class UserRole(models.Model):
    ADMIN = 'Admin'
    STAFF = 'Staff'
    ROLE_CHOICES = ((ADMIN, ADMIN), (STAFF, STAFF))
    role_name = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.role_name
