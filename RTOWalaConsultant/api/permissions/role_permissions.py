from rest_framework.permissions import BasePermission

class AdminCanDeleteStaffCannotDelete(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role = getattr(getattr(request.user, 'role', None), 'role_name', None)
        if request.method == 'DELETE':
            return role == 'Admin' or request.user.is_superuser
        return role in ['Admin', 'Staff'] or request.user.is_superuser
