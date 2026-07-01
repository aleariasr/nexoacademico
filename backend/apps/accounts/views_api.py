from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from apps.academic.models import UserProfile
from rest_framework import viewsets

from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserManagementSerializer,
    UserSerializer,
)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "token": token.key,
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            token, _ = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "token": token.key,
                    "user": UserSerializer(user).data,
                }
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            UserSerializer(request.user).data
        )
    
class UserListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.query_params.get("role")

        queryset = User.objects.select_related("profile").all().order_by("username")

        if role:
            queryset = queryset.filter(profile__role=role)

        return Response(UserSerializer(queryset, many=True).data)
    
class UserManagementViewSet(viewsets.ModelViewSet):
    serializer_class = UserManagementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.select_related("profile").all().order_by("username")

    def check_permissions(self, request):
        super().check_permissions(request)

        is_admin = (
            request.user.is_staff
            or hasattr(request.user, "profile")
            and request.user.profile.role == UserProfile.ROLE_ADMIN
        )

        if not is_admin:
            self.permission_denied(
                request,
                message="Only administrators can manage users.",
            )