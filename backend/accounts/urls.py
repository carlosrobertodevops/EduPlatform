# from django.urls import path

# from accounts.views import SignUpView, SignInView

# urlpatterns = [
#     path('signup/', SignUpView.as_view()),
#     path('signin/', SignInView.as_view())
# ]

<<<<<<< HEAD
from django.urls import path

from .views import SignInView, SignUpView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("signin/", SignInView.as_view(), name="signin"),
=======

from django.urls import path

from .views import SignUpView

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
>>>>>>> a0f0d90 (Ajustes)
]
