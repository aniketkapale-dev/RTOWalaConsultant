from django.db import models
from .base import BaseModel

class ErrorLogs(BaseModel):
    msg = models.CharField(max_length=1000)
    path = models.CharField(max_length=255, blank=True, null=True)
    method = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.msg[:80]
