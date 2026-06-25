from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views_api import (
    AcademicTaskViewSet,
    CourseViewSet,
    DashboardAPIView,
    StatisticsAPIView,
    TaskTypeViewSet,
)

router = DefaultRouter()

router.register(
    "courses",
    CourseViewSet,
    basename="courses",
)

router.register(
    "task-types",
    TaskTypeViewSet,
    basename="task-types",
)

router.register(
    "tasks",
    AcademicTaskViewSet,
    basename="tasks",
)

urlpatterns = [
    path(
        "dashboard/",
        DashboardAPIView.as_view(),
        name="dashboard",
    ),
    path(
        "statistics/",
        StatisticsAPIView.as_view(),
        name="statistics",
    ),
    path(
        "",
        include(router.urls),
    ),
]