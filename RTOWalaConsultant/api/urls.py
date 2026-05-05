from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import RoleViewSet, UserViewSet, ClientViewSet, VehicleViewSet, VehicleDocumentCategoryViewSet, VehicleDocumentViewSet, DashboardViewSet, ErrorLogViewSet
from api.views.auth_view import LoginView, RefreshTokenView

router = DefaultRouter()
router.register('roles', RoleViewSet, basename='roles')
router.register('users', UserViewSet, basename='users')
router.register('clients', ClientViewSet, basename='clients')
router.register('vehicles', VehicleViewSet, basename='vehicles')
router.register('document-categories', VehicleDocumentCategoryViewSet, basename='document-categories')
router.register('vehicle-documents', VehicleDocumentViewSet, basename='vehicle-documents')
router.register('dashboard', DashboardViewSet, basename='dashboard')
router.register('error-logs', ErrorLogViewSet, basename='error-logs')
urlpatterns = [path('auth/login/', LoginView.as_view()), path('auth/refresh-token/', RefreshTokenView.as_view())]
urlpatterns += router.urls
