from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


class SignUpSerializer(serializers.Serializer):
    """Serializer de cadastro compatível com o frontend.

    O frontend (e seus testes no Postman) enviam:
      - name
      - email
      - password
      - password_confirmation (ou confirmPassword / password_confirm)
    """

    name = serializers.CharField(required=True, allow_blank=False, max_length=80)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirmation = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=""
    )

    def to_internal_value(self, data):
        data = dict(data)

        # Aceita variações de nome do campo de confirmação
        if "confirmPassword" in data and "password_confirmation" not in data:
            data["password_confirmation"] = data.get("confirmPassword")
        if "passwordConfirm" in data and "password_confirmation" not in data:
            data["password_confirmation"] = data.get("passwordConfirm")
        if "passwordConfirmation" in data and "password_confirmation" not in data:
            data["password_confirmation"] = data.get("passwordConfirmation")
        if "password_confirm" in data and "password_confirmation" not in data:
            data["password_confirmation"] = data.get("password_confirm")

        return super().to_internal_value(data)

    def validate(self, attrs):
        pwd = attrs.get("password")
        pwd2 = (attrs.get("password_confirmation") or "").strip()
        if pwd2 and pwd != pwd2:
            raise serializers.ValidationError(
                {"password_confirmation": "As senhas não conferem."}
            )
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].strip().lower()
        name = (validated_data.get("name") or "").strip()
        password = validated_data["password"]

        # create_user já seta hash
        try:
            return User.objects.create_user(email=email, password=password, name=name)
        except Exception as e:
            raise serializers.ValidationError({"detail": str(e)})


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def to_internal_value(self, data):
        data = dict(data)

        # Aceita variações de nome de campo
        if "user" in data and "username" not in data:
            data["username"] = data.get("user")
        if "login" in data and "username" not in data and "email" not in data:
            data["username"] = data.get("login")

        # Remove campos extras que alguns forms enviam
        data.pop("password_confirmation", None)
        data.pop("passwordConfirm", None)
        data.pop("passwordConfirmation", None)

        return super().to_internal_value(data)

    def validate(self, attrs):
        email = (attrs.get("email") or "").strip()
        username = (attrs.get("username") or "").strip()
        password = attrs.get("password")

        if not email and not username:
            raise serializers.ValidationError({"detail": "Informe email ou username."})

        user = None

        # Neste projeto, o USERNAME_FIELD é o email.
        if email:
            user = authenticate(username=email, password=password)

        # fallback: alguns formulários podem mandar "username"
        if user is None and username:
            user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError({"detail": "Credenciais inválidas."})

        attrs["user"] = user
        return attrs
