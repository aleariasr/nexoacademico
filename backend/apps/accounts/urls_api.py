from django.urls import path

from .views_api import (
    LoginAPIView,
    MeAPIView,
    RegisterAPIView,
)

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="api-register"),
    path("login/", LoginAPIView.as_view(), name="api-login"),
    path("me/", MeAPIView.as_view(), name="api-me"),
]