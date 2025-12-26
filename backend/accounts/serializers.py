# from rest_framework import serializers

# from accounts.models import User

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'name', 'email']
#
<<<<<<< HEAD
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de usuário.
    Aceita:
      - name (nome completo) [opcional]
      - email
      - password
      - password_confirm
    """

    name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "name", "email", "password", "password_confirm"]

    def validate_email(self, value):
        email = (value or "").strip().lower()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Este email já está cadastrado.")
        return email

    def validate(self, attrs):
        password = attrs.get("password")
        password_confirm = attrs.get("password_confirm")

        if password != password_confirm:
            raise serializers.ValidationError(
                {"password_confirm": "As senhas não conferem."}
            )

        # valida password do Django
        validate_password(password)
        return attrs

    def create(self, validated_data):
        name = (validated_data.get("name") or "").strip()
        email = validated_data["email"].strip().lower()
        password = validated_data["password"]

        # remove campos extras
        validated_data.pop("password_confirm", None)
        validated_data.pop("password", None)

        # tenta mapear nome para campos comuns (first_name/last_name) se existirem
        user = User(email=email)

        if hasattr(user, "first_name") or hasattr(user, "last_name"):
            # split simples do nome completo
            parts = name.split()
            if parts:
                if hasattr(user, "first_name"):
                    user.first_name = parts[0]
                if hasattr(user, "last_name"):
                    user.last_name = " ".join(parts[1:]) if len(parts) > 1 else ""
        elif hasattr(user, "name"):
            user.name = name

        user.set_password(password)
        user.save()
        return user


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
=======

from django.contrib.auth.models import User
from rest_framework import serializers


class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["password"] != data["password_confirmation"]:
            raise serializers.ValidationError("Passwords do not match")

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already registered")

        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["name"],
        )
        return user
>>>>>>> a0f0d90 (Ajustes)
