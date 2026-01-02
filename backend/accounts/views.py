from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignupSerializer

User = get_user_model()


def _response(
    success: bool, detail: str = "", data=None, http_status=status.HTTP_200_OK
):
    return Response(
        {
            "success": success,
            "data": data or {},
            "detail": detail,
        },
        status=http_status,
    )


class SignUpView(APIView):
    """
    POST /api/v1/accounts/signup/

    Espera o contrato do SignupSerializer (NÃO alterar):
      - name
      - email
      - password
      - password_confirmation (ou password_confirm legado)
    """

    permission_classes = [AllowAny]

    def post(self, request):
        # Garantia para não estourar o model (name não pode ser vazio)
        name = (request.data.get("name") or "").strip()
        if not name:
            return _response(
                success=False,
                detail="Todos os campos são obrigatórios",
                data={"name": "Campo obrigatório."},
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            # Mantém resposta no formato que seu frontend já espera
            return _response(
                success=False,
                detail="Dados inválidos",
                data=serializer.errors,
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()

        return _response(
            success=True,
            detail="Conta criada com sucesso",
            data={
                "user": {
                    "id": user.id,
                    "name": getattr(user, "name", ""),
                    "email": user.email,
                }
            },
            http_status=status.HTTP_201_CREATED,
        )


class SignInView(APIView):
    """
    POST /api/v1/accounts/signin/
    Body: { "email": "...", "password": "..." }

    Retorna access/refresh (SimpleJWT).
    """

    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password") or ""

        if not email or not password:
            return _response(
                success=False,
                detail="Todos os campos são obrigatórios",
                data={"email": "Campo obrigatório.", "password": "Campo obrigatório."},
                http_status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)
        if user is None:
            return _response(
                success=False,
                detail="Credenciais inválidas",
                data={},
                http_status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        return _response(
            success=True,
            detail="Login realizado com sucesso",
            data={
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "name": getattr(user, "name", ""),
                    "email": user.email,
                },
            },
            http_status=status.HTTP_200_OK,
        )
