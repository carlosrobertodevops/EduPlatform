from django.contrib.auth import authenticate, get_user_model
from django.db import IntegrityError, transaction
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class SignUpSerializer(serializers.Serializer):
    """
    Cadastro simples: email + password.
    Opcional: first_name, last_name.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=150)

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        first_name = validated_data.get("first_name", "")
        last_name = validated_data.get("last_name", "")

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=email if hasattr(User, "username") else None,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                )
                user.set_password(password)
                user.save(update_fields=["password"])
        except IntegrityError as exc:
            # Ex.: email único já existe
            raise serializers.ValidationError(
                {"email": ["Este e-mail já está em uso."]}
            ) from exc

        return user


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value: str) -> str:
        return value.strip().lower()


def _jwt_for_user(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# class SignUpView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = SignUpSerializer(data=request.data)
#         if not serializer.is_valid():
#             return Response(
#                 {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
#             )

#         user = serializer.save()
#         tokens = _jwt_for_user(user)

#         return Response(
#             {
#                 "user": {
#                     "id": user.id,
#                     "email": getattr(user, "email", None),
#                     "first_name": getattr(user, "first_name", ""),
#                     "last_name": getattr(user, "last_name", ""),
#                 },
#                 "tokens": tokens,
#             },
#             status=status.HTTP_201_CREATED,
#         )


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")

        # compatibilidade com frontend
        password_confirm = request.data.get("password_confirm") or request.data.get(
            "confirmPassword"
        )

        if not all([name, email, password, password_confirm]):
            return Response(
                {"detail": "Todos os campos são obrigatórios"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != password_confirm:
            return Response(
                {"detail": "As senhas não conferem"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "E-mail já cadastrado"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create(
            email=email,
            username=email,
            first_name=name,
            password=make_password(password),
        )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.first_name,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignInSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        # Se o seu User usa email como username, authenticate funciona com username=email.
        # Caso contrário, tentamos pelo email e depois autenticamos com username.
        user = authenticate(request, username=email, password=password)

        if (
            user is None
            and hasattr(User, "objects")
            and hasattr(User, "USERNAME_FIELD")
        ):
            # fallback: achar usuário pelo email e autenticar pelo USERNAME_FIELD
            try:
                u = User.objects.get(email=email)
                user = authenticate(
                    request, username=getattr(u, User.USERNAME_FIELD), password=password
                )
            except User.DoesNotExist:
                user = None

        if user is None:
            return Response(
                {"detail": "Credenciais inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = _jwt_for_user(user)

        return Response(
            {
                "user": {
                    "id": user.id,
                    "email": getattr(user, "email", None),
                    "first_name": getattr(user, "first_name", ""),
                    "last_name": getattr(user, "last_name", ""),
                },
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )


# from django.contrib.auth import get_user_model
# from django.contrib.auth.hashers import make_password
# from rest_framework import status
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework_simplejwt.tokens import RefreshToken

# User = get_user_model()


# class SignUpView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         name = request.data.get("name")
#         email = request.data.get("email")
#         password = request.data.get("password")

#         # compatibilidade com frontend
#         password_confirm = request.data.get("password_confirm") or request.data.get(
#             "confirmPassword"
#         )

#         if not all([name, email, password, password_confirm]):
#             return Response(
#                 {"detail": "Todos os campos são obrigatórios"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         if password != password_confirm:
#             return Response(
#                 {"detail": "As senhas não conferem"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         if User.objects.filter(email=email).exists():
#             return Response(
#                 {"detail": "E-mail já cadastrado"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         user = User.objects.create(
#             email=email,
#             username=email,
#             first_name=name,
#             password=make_password(password),
#         )

#         refresh = RefreshToken.for_user(user)

#         return Response(
#             {
#                 "access_token": str(refresh.access_token),
#                 "refresh_token": str(refresh),
#                 "user": {
#                     "id": user.id,
#                     "email": user.email,
#                     "name": user.first_name,
#                 },
#             },
#             status=status.HTTP_201_CREATED,
#         )
