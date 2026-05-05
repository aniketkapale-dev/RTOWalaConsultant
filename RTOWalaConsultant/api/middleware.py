import traceback
from django.utils.deprecation import MiddlewareMixin

class ErrorLoggingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        try:
            from api.models import ErrorLogs
            ErrorLogs.objects.create(
                path=request.path,
                method=request.method,
                error_message=str(exception),
                traceback=traceback.format_exc(),
                user=request.user if request.user.is_authenticated else None,
            )
        except Exception:
            pass
        return None