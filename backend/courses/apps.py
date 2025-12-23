import stripe
from decouple import config
from django.apps import AppConfig


class CoursesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "courses"

    def ready(self):
        """
        Não derruba o Django se STRIPE_SECRET_KEY não existir (dev/Docker).
        """
        stripe.api_key = config("STRIPE_SECRET_KEY", default="")
