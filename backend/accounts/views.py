<<<<<<< HEAD
# from django.contrib.auth import get_user_model
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework_simplejwt.tokens import RefreshToken

# from .serializers import SignupSerializer

# User = get_user_model()


# class SignupView(APIView):
#     permission_classes = []

#     def post(self, request):
#         serializer = SignupSerializer(data=request.data)

#         if not serializer.is_valid():
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         user = serializer.save()

#         refresh = RefreshToken.for_user(user)

#         return Response(
#             {
#                 "access_token": str(refresh.access_token),
#                 "refresh_token": str(refresh),
#                 "user": {
#                     "id": user.id,
#                     "email": user.email,
#                     "name": user.get_full_name(),
#                 },
#             },
#             status=status.HTTP_201_CREATED,
#         )


from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignInSerializer, SignupSerializer

User = get_user_model()

=======
# from rest_framework.views import APIView
# from rest_framework.permissions import AllowAny
# from rest_framework.request import Request
# from rest_framework.response import Response
# from rest_framework.exceptions import AuthenticationFailed

# from rest_framework_simplejwt.tokens import RefreshToken

# from accounts.models import User
# from accounts.serializers import UserSerializer

# from core.utils.exceptions import ValidationError
# from core.utils.formatters import format_serializer_error

# from django.contrib.auth.hashers import make_password, check_password

# class SignInView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request: Request):
#         email = request.data.get('email', '')
#         password = request.data.get('password', '')

#         if not email or not password:
#             raise ValidationError

#         user = User.objects.filter(email=email).first()

#         if not user:
#             raise AuthenticationFailed("Email e/ou senha inválido(s)")

#         if not check_password(password, user.password):
#             raise AuthenticationFailed("Email e/ou senha inválido(s)")

#         user_data = UserSerializer(user).data
#         access_token = RefreshToken.for_user(user).access_token

#         return Response({
#             "user": user_data,
#             "access_token": str(access_token)
#         })

# class SignUpView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request: Request):
#         data = {
#             "name": request.data.get('name'),
#             "email": request.data.get('email'),
#             "password": request.data.get('password')
#         }

#         serializer = UserSerializer(data=data)

#         if not serializer.is_valid():
#             raise ValidationError(format_serializer_error(serializer.errors))

#         user = User.objects.create(
#             name=data.get('name'),
#             email=data.get('email'),
#             password=make_password(data.get('password'))
#         )

#         access_token = RefreshToken.for_user(user).access_token

#         return Response({
#             "user": UserSerializer(user).data,
#             "access_token": str(access_token)
#         })

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SignupSerializer

>>>>>>> a0f0d90 (Ajustes)

class SignUpView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
<<<<<<< HEAD
                {
                    "success": False,
                    "detail": "Validation error",
                    "code": "VALIDATION_ERROR",
                    "data": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        # tenta extrair um "name" legível
        name = ""
        if hasattr(user, "get_full_name"):
            name = user.get_full_name() or ""
        if not name and hasattr(user, "name"):
            name = getattr(user, "name") or ""
        if not name:
            name = user.email

        return Response(
            {
                "success": True,
                "detail": "User created",
                "code": "USER_CREATED",
                "data": {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": name,
                    },
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
                {
                    "success": False,
                    "detail": "Validation error",
                    "code": "VALIDATION_ERROR",
                    "data": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        user = authenticate(request, username=email, password=password)

        # se seu AUTH_USER_MODEL usa email como USERNAME_FIELD, isso funciona.
        # se não usar, você precisará ajustar a autenticação no backend.
        if not user:
            return Response(
                {
                    "success": False,
                    "detail": "Credenciais inválidas",
                    "code": "INVALID_CREDENTIALS",
                    "data": None,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        name = ""
        if hasattr(user, "get_full_name"):
            name = user.get_full_name() or ""
        if not name and hasattr(user, "name"):
            name = getattr(user, "name") or ""
        if not name:
            name = user.email

        return Response(
            {
                "success": True,
                "detail": "Authenticated",
                "code": "AUTHENTICATED",
                "data": {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": name,
                    },
                },
            },
            status=status.HTTP_200_OK,
        )
=======
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        return Response(
            {"message": "User created successfully"}, status=status.HTTP_201_CREATED
        )
>>>>>>> a0f0d90 (Ajustes)
