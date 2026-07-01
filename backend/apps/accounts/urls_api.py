from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views_api import (
    LoginAPIView,
    MeAPIView,
    RegisterAPIView,
    UserListAPIView,
    UserManagementViewSet,
)

router = DefaultRouter()
router.register("manage-users", UserManagementViewSet, basename="manage-users")

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="api-register"),
    path("login/", LoginAPIView.as_view(), name="api-login"),
    path("me/", MeAPIView.as_view(), name="api-me"),
    path("users/", UserListAPIView.as_view(), name="api-users"),
    path("", include(router.urls)),
]