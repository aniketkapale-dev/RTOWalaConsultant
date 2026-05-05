from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from api.permissions.role_permissions import AdminCanDeleteStaffCannotDelete

class BaseViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, AdminCanDeleteStaffCannotDelete]

    def success(self, data=None, message='Success'):
        return Response({'data': data, 'message': message, 'isSuccess': True, 'actual_error': None})

    def error(self, message='Error', data=None, status_code=status.HTTP_400_BAD_REQUEST, actual_error=None):
        return Response({'data': data, 'message': message, 'isSuccess': False, 'actual_error': actual_error if actual_error is not None else message}, status=status_code)

    def list(self, request, *args, **kwargs):
        return self.success(super().list(request, *args, **kwargs).data, 'Fetched successfully')
    def retrieve(self, request, *args, **kwargs):
        return self.success(super().retrieve(request, *args, **kwargs).data, 'Fetched successfully')
    def create(self, request, *args, **kwargs):
        return self.success(super().create(request, *args, **kwargs).data, 'Created successfully')
    def update(self, request, *args, **kwargs):
        return self.success(super().update(request, *args, **kwargs).data, 'Updated successfully')
    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return self.success(None, 'Deleted successfully')
