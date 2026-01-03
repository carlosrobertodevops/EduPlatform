import os

from django.core.wsgi import get_wsgi_application

# Corrige o erro "No module named 'project'"
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

application = get_wsgi_application()
