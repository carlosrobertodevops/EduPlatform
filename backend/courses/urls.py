from rest_framework.routers import DefaultRouter

from django.urls import path

from courses.views import CourseViewSet, LessonMarkAsWatchedView, ProcessCheckoutView

router = DefaultRouter()
router.register('', CourseViewSet, basename='course')

urlpatterns = router.urls + [
    path('process_checkout', ProcessCheckoutView.as_view()),
    path('lessons/<int:lesson_id>/watched/', LessonMarkAsWatchedView.as_view())
]
