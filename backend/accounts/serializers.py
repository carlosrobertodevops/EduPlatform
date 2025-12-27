from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de usuário.

    Contrato da API (frontend/clients):
      - name (opcional)
      - email
      - password
      - password_confirmation

    Compatibilidade:
      - também aceita password_confirm (legado), caso algum client ainda envie assim.
    """

    name = serializers.CharField(required=False, allow_blank=True)

    # Campo principal (contrato atual)
    password_confirmation = serializers.CharField(write_only=True, required=False)

    # Campo legado (alguma parte do projeto antigo pode ter usado isso)
    password_confirm = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "password",
            "password_confirmation",
            "password_confirm",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, attrs):
        password = attrs.get("password")

        # Prioriza o contrato atual; cai para legado se necessário
        confirmation = attrs.get("password_confirmation") or attrs.get(
            "password_confirm"
        )

        if not password or not confirmation:
            raise serializers.ValidationError(
                {"password_confirmation": "Campo obrigatório."}
            )

        if password != confirmation:
            raise serializers.ValidationError(
                {"password_confirmation": "As senhas não coincidem."}
            )

        return attrs

    def create(self, validated_data):
        # Remove campos auxiliares antes de criar o usuário
        validated_data.pop("password_confirmation", None)
        validated_data.pop("password_confirm", None)

        password = validated_data.pop("password")
        name = validated_data.pop("name", "")

        user = User(
            name=name,
            email=validated_data.get("email"),
        )
        user.set_password(password)
        user.save()

        return user
