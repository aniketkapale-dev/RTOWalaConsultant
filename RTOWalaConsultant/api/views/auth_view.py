from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response

class LoginView(TokenObtainPairView):
    pass
class RefreshTokenView(TokenRefreshView):
    pass
