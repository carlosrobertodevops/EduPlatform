from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Manager compatível com o schema atual do banco (migration 0001).

    Importante: este projeto já possui a tabela `users` (db_table) criada pela
    migration 0001_initial, com as colunas: name, email, is_superuser.

    Em versões anteriores, o model foi alterado (full_name/is_staff/etc.) sem
    gerar/aplicar novas migrations, causando 500 ao criar usuário.
    """

    def create_user(self, email, password=None, name="", **extra_fields):
        if not email:
            raise ValueError("O usuário deve ter um e-mail")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name or "", **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, name="", **extra_fields):
        user = self.create_user(
            email=email, password=password, name=name, **extra_fields
        )
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """User mínimo para autenticação por email.

    Mantém compatibilidade com a migration 0001 (tabela `users`).
    """

    name = models.CharField(max_length=80)
    email = models.EmailField(unique=True)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        # Django admin e permissões básicas
        return bool(self.is_superuser)

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    class Meta:
        db_table = "users"
