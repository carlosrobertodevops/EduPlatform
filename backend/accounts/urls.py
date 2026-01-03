# from django.urls import path

# from .views import SignInView, SignUpView

# urlpatterns = [
#     path("signup/", SignUpView.as_view(), name="signup"),
#     path("signin/", SignInView.as_view(), name="signin"),
# ]


from django.urls import re_path

from .views import SignInView, SignUpView

urlpatterns = [
    re_path(r"^signup/?$", SignUpView.as_view(), name="accounts-signup"),
    re_path(r"^signin/?$", SignInView.as_view(), name="accounts-signin"),
]
