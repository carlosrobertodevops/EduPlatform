from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SignupSerializer


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # request.data pode ser QueryDict (imutável). Copiamos para editar.
        data = request.data.copy()

        # ---------
        # Normalizações para compatibilidade com o Frontend/Postman
        # ---------

        # 1) Frontend envia confirmPassword -> serializer espera password_confirmation (ou password_confirm)
        if (
            "confirmPassword" in data
            and "password_confirmation" not in data
            and "password_confirm" not in data
        ):
            data["password_confirmation"] = data.get("confirmPassword")

        # Compat: alguns clients podem enviar passwordConfirmation
        if (
            "passwordConfirmation" in data
            and "password_confirmation" not in data
            and "password_confirm" not in data
        ):
            data["password_confirmation"] = data.get("passwordConfirmation")

        # 2) Postman/legado pode enviar first_name + last_name -> serializer usa name
        if "name" not in data or not str(data.get("name", "")).strip():
            first_name = str(data.get("first_name", "")).strip()
            last_name = str(data.get("last_name", "")).strip()
            full_name = (first_name + " " + last_name).strip()
            if full_name:
                data["name"] = full_name

        # Compat: caso alguém envie nome_completo/full_name
        if "name" not in data or not str(data.get("name", "")).strip():
            if "nome_completo" in data and str(data.get("nome_completo", "")).strip():
                data["name"] = data.get("nome_completo")
            elif "full_name" in data and str(data.get("full_name", "")).strip():
                data["name"] = data.get("full_name")

        serializer = SignupSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "success": True,
                    "data": {
                        "id": user.id,
                        "email": user.email,
                        "name": getattr(user, "name", ""),
                    },
                    "detail": "Usuário criado com sucesso.",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "data": serializer.errors,
                "detail": "Erro de validação.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {
                    "success": False,
                    "data": {},
                    "detail": "Email e senha são obrigatórios.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)

        if not user:
            return Response(
                {
                    "success": False,
                    "data": {},
                    "detail": "Credenciais inválidas.",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                "success": True,
                "data": {
                    "id": user.id,
                    "email": user.email,
                    "name": getattr(user, "name", ""),
                },
                "detail": "Login realizado com sucesso.",
            },
            status=status.HTTP_200_OK,
        )
