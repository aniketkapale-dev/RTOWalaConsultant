from pathlib import Path
import os
from datetime import timedelta
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = [h.strip() for h in os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')]

INSTALLED_APPS = [
    'django.contrib.admin','django.contrib.auth','django.contrib.contenttypes','django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles',
    'rest_framework','rest_framework_simplejwt','drf_spectacular','corsheaders','api',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware','django.middleware.security.SecurityMiddleware','django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware','django.middleware.csrf.CsrfViewMiddleware','django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware','django.middleware.clickjacking.XFrameOptionsMiddleware','api.middleware.ErrorLoggingMiddleware',
]
ROOT_URLCONF='RTOWalaConsultant.urls'
TEMPLATES=[{'BACKEND':'django.template.backends.django.DjangoTemplates','DIRS':[BASE_DIR/'ui'/'template_view'],'APP_DIRS':True,'OPTIONS':{'context_processors':['django.template.context_processors.debug','django.template.context_processors.request','django.contrib.auth.context_processors.auth','django.contrib.messages.context_processors.messages']}}]
WSGI_APPLICATION='RTOWalaConsultant.wsgi.application'

DATABASES={'default':{'ENGINE':'django.db.backends.mysql','NAME':os.getenv('DB_NAME','rtowala_consultant'),'USER':os.getenv('DB_USER','root'),'PASSWORD':os.getenv('DB_PASSWORD','tiger'),'HOST':os.getenv('DB_HOST','127.0.0.1'),'PORT':os.getenv('DB_PORT','3306'),'OPTIONS':{'charset':'utf8mb4'}}}
AUTH_USER_MODEL='api.User'
LANGUAGE_CODE='en-us'; TIME_ZONE='Asia/Kolkata'; USE_I18N=True; USE_TZ=True
STATIC_URL='static/'; STATICFILES_DIRS=[BASE_DIR/'static']; STATIC_ROOT=BASE_DIR/'staticfiles'
MEDIA_URL='media/'; MEDIA_ROOT=BASE_DIR/'media'
DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'
REST_FRAMEWORK={
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'api.pagination.DefaultPagination',
    'PAGE_SIZE': 10,
}
SIMPLE_JWT={'ACCESS_TOKEN_LIFETIME':timedelta(hours=8),'REFRESH_TOKEN_LIFETIME':timedelta(days=7)}
SPECTACULAR_SETTINGS={'TITLE':'RTOWalaConsultant API','DESCRIPTION':'Vehicle, client and document expiry management API','VERSION':'1.0.0'}
CORS_ALLOW_ALL_ORIGINS=True
