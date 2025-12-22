from decouple import config
from django.apps import AppConfig


class CoursesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "courses"

    def ready(self):
        """
        Configura Stripe apenas se STRIPE_SECRET_KEY estiver definida.
        Não derruba o Django quando a variável não existe (dev/Docker).
        """
        try:
            import stripe
        except Exception:
            return

        stripe_key = config("STRIPE_SECRET_KEY", default="").strip()
        if stripe_key:
            stripe.api_key = stripe_key
