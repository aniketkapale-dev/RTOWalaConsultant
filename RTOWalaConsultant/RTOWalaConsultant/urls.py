from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('', TemplateView.as_view(template_name='partial_view/login.html'), name='login'),
    path('not-authenticated/', TemplateView.as_view(template_name='partial_view/not_authenticated.html'), name='not-authenticated'),
    path('dashboard/', TemplateView.as_view(template_name='partial_view/dashboard.html'), name='dashboard'),
    path('clients/', TemplateView.as_view(template_name='partial_view/clients.html'), name='clients'),
    path('vehicles/', TemplateView.as_view(template_name='partial_view/vehicles.html'), name='vehicles'),
    path('documents/', TemplateView.as_view(template_name='partial_view/documents.html'), name='documents'),
    path('update-insurance/', TemplateView.as_view(template_name='partial_view/insurance.html'), name='update-insurance'),
    path('users/', TemplateView.as_view(template_name='partial_view/users.html'), name='users'),
    path('error-logs/', TemplateView.as_view(template_name='partial_view/error_logs.html'), name='error-logs'),
]
