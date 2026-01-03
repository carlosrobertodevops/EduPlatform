from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


class SignUpSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_blank=True, default="")
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(
        write_only=True, required=False, allow_blank=True, default=""
    )

    def to_internal_value(self, data):
        data = dict(data)

        # Aceita variações de nome de campo
        if "passwordConfirm" in data and "password_confirmation" not in data:
            data["password_confirmation"] = data.get("passwordConfirm")
        if "passwordConfirmation" in data and "password_confirmation" not in data:
            data["password_confirmation"] = data.get("passwordConfirmation")

        return super().to_internal_value(data)

    def validate(self, attrs):
        pwd = attrs.get("password")
        pwd2 = (
            attrs.get("password_confirmation")
            or attrs.get("passwordConfirm")
            or attrs.get("passwordConfirmation")
            or ""
        )
        if pwd2 and pwd != pwd2:
            raise serializers.ValidationError(
                {"password_confirmation": "As senhas não conferem."}
            )
        return attrs

    def create(self, validated_data):
        name = (validated_data.get("name") or "").strip()
        email = validated_data["email"].strip().lower()
        password = validated_data["password"]

        # Compatível com User padrão e User custom
        if hasattr(User, "USERNAME_FIELD") and User.USERNAME_FIELD == "email":
            user = User.objects.create_user(email=email, password=password)
        else:
            # se o user usa username, derive a partir do email
            username_field = getattr(User, "USERNAME_FIELD", "username")
            if username_field != "email":
                username_value = email.split("@")[0]
                kwargs = {"email": email, username_field: username_value}
                user = User.objects.create_user(**kwargs)
                user.set_password(password)
                user.save(update_fields=["password"])
            else:
                user = User.objects.create_user(email=email, password=password)

        # Nome
        if hasattr(user, "name"):
            user.name = name
            user.save(update_fields=["name"])
        elif hasattr(user, "first_name"):
            user.first_name = name
            user.save(update_fields=["first_name"])

        return user


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

        if username:
            user = authenticate(username=username, password=password)

        if user is None and email:
            try:
                u = User.objects.get(email__iexact=email)
                user = authenticate(username=u.get_username(), password=password)
            except User.DoesNotExist:
                user = None

        if user is None:
            raise serializers.ValidationError({"detail": "Credenciais inválidas."})

        attrs["user"] = user
        return attrs


# from django.contrib.auth import get_user_model
# from rest_framework import serializers

# User = get_user_model()


# class SignupSerializer(serializers.ModelSerializer):
#     """
#     Serializer para criação de usuário.

#     Contrato da API (frontend/clients):
#       - name (opcional)
#       - email
#       - password
#       - password_confirmation

#     Compatibilidade:
#       - também aceita password_confirm (legado), caso algum client ainda envie assim.
#     """

#     name = serializers.CharField(required=False, allow_blank=True)

#     # Campo principal (contrato atual)
#     password_confirmation = serializers.CharField(write_only=True, required=False)

#     # Campo legado (alguma parte do projeto antigo pode ter usado isso)
#     password_confirm = serializers.CharField(write_only=True, required=False)

#     class Meta:
#         model = User
#         fields = [
#             "name",
#             "email",
#             "password",
#             "password_confirmation",
#             "password_confirm",
#         ]
#         extra_kwargs = {
#             "password": {"write_only": True},
#         }

#     def validate(self, attrs):
#         password = attrs.get("password")

#         # Prioriza o contrato atual; cai para legado se necessário
#         confirmation = attrs.get("password_confirmation") or attrs.get(
#             "password_confirm"
#         )

#         if not password or not confirmation:
#             raise serializers.ValidationError(
#                 {"password_confirmation": "Campo obrigatório."}
#             )

#         if password != confirmation:
#             raise serializers.ValidationError(
#                 {"password_confirmation": "As senhas não coincidem."}
#             )

#         return attrs

#     def create(self, validated_data):
#         # Remove campos auxiliares antes de criar o usuário
#         validated_data.pop("password_confirmation", None)
#         validated_data.pop("password_confirm", None)

#         password = validated_data.pop("password")
#         name = validated_data.pop("name", "")

#         user = User(
#             name=name,
#             email=validated_data.get("email"),
#         )
#         user.set_password(password)
#         user.save()

#         return user
