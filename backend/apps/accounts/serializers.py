from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from apps.academic.models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(
        source="profile.role",
        read_only=True,
    )
    degree_program = serializers.CharField(
        source="profile.degree_program",
        read_only=True,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "degree_program",
        ]
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "password_confirm",
        ]

    def validate_email(self, value):
        normalized_email = value.lower().strip()

        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return normalized_email

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError(
                {
                    "password_confirm": "Passwords do not match."
                }
            )

        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")

        password = validated_data.pop("password")
        email = validated_data.pop("email").lower().strip()

        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data,
        )

        UserProfile.objects.create(
            user=user,
            role=UserProfile.ROLE_STUDENT,
        )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True,
    )

    def validate(self, data):
        user = authenticate(
            username=data["username"],
            password=data["password"],
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid credentials."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        data["user"] = user

        return data
    
class UserManagementSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES,
        write_only=True,
        required=True,
    )
    degree_program = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
    )

    profile_role = serializers.CharField(
        source="profile.role",
        read_only=True,
    )
    profile_degree_program = serializers.CharField(
        source="profile.degree_program",
        read_only=True,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "is_active",
            "role",
            "degree_program",
            "profile_role",
            "profile_degree_program",
        ]
        read_only_fields = [
            "id",
            "profile_role",
            "profile_degree_program",
        ]

    def create(self, validated_data):
        role = validated_data.pop("role")
        degree_program = validated_data.pop("degree_program", "")
        password = validated_data.pop("password", None)

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        UserProfile.objects.create(
            user=user,
            role=role,
            degree_program=degree_program,
        )

        return user

    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)
        degree_program = validated_data.pop("degree_program", None)
        password = validated_data.pop("password", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if password:
            instance.set_password(password)

        instance.save()

        profile, _ = UserProfile.objects.get_or_create(user=instance)

        if role:
            profile.role = role

        if degree_program is not None:
            profile.degree_program = degree_program

        profile.save()

        return instance