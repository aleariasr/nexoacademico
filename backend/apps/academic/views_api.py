from django.db import connection
from django.db.models import Avg, Sum
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AcademicTask, Course, TaskHistory, TaskType
from .serializers import (
    AcademicTaskSerializer,
    CourseSerializer,
    DashboardSerializer,
    TaskHistorySerializer,
    TaskTypeSerializer,
)


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TaskType.objects.all()
    serializer_class = TaskTypeSerializer
    permission_classes = [IsAuthenticated]


class AcademicTaskViewSet(viewsets.ModelViewSet):
    serializer_class = AcademicTaskSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = [
        "title",
        "description",
        "course__name",
        "course__code",
        "task_type__name",
    ]
    ordering_fields = [
        "due_date",
        "priority",
        "status",
        "created_at",
        "updated_at",
        "progress_percentage",
        "grade",
    ]
    ordering = ["due_date"]

    def get_queryset(self):
        queryset = (
            AcademicTask.objects
            .filter(user=self.request.user, is_deleted=False)
            .select_related("course", "task_type")
        )

        status_value = self.request.query_params.get("status")
        priority = self.request.query_params.get("priority")
        course = self.request.query_params.get("course")
        overdue = self.request.query_params.get("overdue")

        if status_value:
            queryset = queryset.filter(status=status_value)

        if priority:
            queryset = queryset.filter(priority=priority)

        if course:
            queryset = queryset.filter(course_id=course)

        if overdue == "true":
            queryset = queryset.filter(
                due_date__lt=timezone.now(),
            ).exclude(
                status=AcademicTask.STATUS_COMPLETED,
            )

        return queryset

    def perform_create(self, serializer):
        academic_task = serializer.save(user=self.request.user)

        TaskHistory.objects.create(
            academic_task=academic_task,
            user=self.request.user,
            action="created",
            description=f'Task "{academic_task.title}" was created.',
        )

    def perform_update(self, serializer):
        academic_task = serializer.save()

        TaskHistory.objects.create(
            academic_task=academic_task,
            user=self.request.user,
            action="updated",
            description=f'Task "{academic_task.title}" was updated.',
        )

    def perform_destroy(self, instance):
        with connection.cursor() as cursor:
            cursor.callproc(
                "sp_soft_delete_task",
                [
                    instance.id,
                    self.request.user.id,
                ],
            )

        instance.refresh_from_db()

        TaskHistory.objects.create(
            academic_task=instance,
            user=self.request.user,
            action="deleted",
            description=f'Task "{instance.title}" was soft deleted using stored procedure sp_soft_delete_task.',
        )

    @action(detail=True, methods=["get"], url_path="history")
    def history(self, request, pk=None):
        academic_task = self.get_object()
        history = academic_task.history.all()
        serializer = TaskHistorySerializer(history, many=True)

        return Response(serializer.data)


class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.callproc(
                "sp_get_user_dashboard",
                [request.user.id],
            )
            row = cursor.fetchone()

        active_courses = row[0] if row else 0
        pending_tasks = row[1] if row else 0
        in_progress_tasks = row[2] if row else 0
        completed_tasks = row[3] if row else 0
        overdue_tasks = row[4] if row else 0

        tasks = (
            AcademicTask.objects
            .filter(user=request.user, is_deleted=False)
            .select_related("course", "task_type")
        )

        total_tasks = tasks.count()

        completion_rate = (
            round((completed_tasks / total_tasks) * 100, 2)
            if total_tasks > 0
            else 0
        )

        upcoming_tasks = tasks.order_by("due_date")[:5]

        data = {
            "active_courses": active_courses,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completed_tasks": completed_tasks,
            "overdue_tasks": overdue_tasks,
            "completion_rate": completion_rate,
            "upcoming_tasks": upcoming_tasks,
        }

        serializer = DashboardSerializer(data)

        return Response(serializer.data)


class StatisticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.filter(user=request.user)
        tasks = AcademicTask.objects.filter(user=request.user, is_deleted=False)

        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status=AcademicTask.STATUS_COMPLETED).count()

        completion_rate = (
            round((completed_tasks / total_tasks) * 100, 2)
            if total_tasks > 0
            else 0
        )

        average_grade = tasks.exclude(grade__isnull=True).aggregate(
            average=Avg("grade")
        )["average"]

        total_active_credits = courses.filter(
            status=Course.STATUS_ACTIVE,
        ).aggregate(
            total=Sum("credits")
        )["total"] or 0

        high_priority_tasks = tasks.filter(
            priority__in=[
                AcademicTask.PRIORITY_HIGH,
                AcademicTask.PRIORITY_CRITICAL,
            ]
        ).count()

        return Response(
            {
                "total_courses": courses.count(),
                "active_courses": courses.filter(status=Course.STATUS_ACTIVE).count(),
                "total_active_credits": total_active_credits,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": tasks.filter(status=AcademicTask.STATUS_PENDING).count(),
                "in_progress_tasks": tasks.filter(
                    status=AcademicTask.STATUS_IN_PROGRESS
                ).count(),
                "high_priority_tasks": high_priority_tasks,
                "completion_rate": completion_rate,
                "average_grade": round(float(average_grade), 2)
                if average_grade is not None
                else None,
            }
        )