from django.db import connection
from django.db.models import Avg, Sum
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView

from .models import (
    AcademicTask,
    Course,
    CourseEnrollment,
    TaskHistory,
    TaskSubmission,
    TaskType,
)
from .serializers import (
    AcademicTaskSerializer,
    CourseEnrollmentSerializer,
    CourseSerializer,
    DashboardSerializer,
    TaskHistorySerializer,
    TaskSubmissionSerializer,
    TaskTypeSerializer,
)

def is_admin_user(user):
    return (
        user.is_staff
        or hasattr(user, "profile")
        and user.profile.role == "admin"
    )

def is_professor_user(user):
    return (
        hasattr(user, "profile")
        and user.profile.role == "professor"
    )


def can_manage_courses(user):
    return is_admin_user(user)


def can_manage_course_content(user, course):
    return (
        is_admin_user(user)
        or course.professor_user_id == user.id
    )

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if is_admin_user(self.request.user):
            return Course.objects.all()

        if is_professor_user(self.request.user):
            return Course.objects.filter(
                professor_user=self.request.user,
            )

        return Course.objects.filter(
            enrollments__student=self.request.user,
        ).distinct()

    def perform_create(self, serializer):
        if not can_manage_courses(self.request.user):
            raise PermissionDenied("Only administrators can create courses.")

        serializer.save(user=self.request.user)


class TaskTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TaskType.objects.all()
    serializer_class = TaskTypeSerializer
    permission_classes = [IsAuthenticated]

class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = CourseEnrollment.objects.select_related(
            "course",
            "student",
        )

        if is_admin_user(self.request.user):
            return queryset

        if is_professor_user(self.request.user):
            return queryset.filter(
                course__professor_user=self.request.user,
            )

        return queryset.filter(
            student=self.request.user,
        )

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]

        if not can_manage_course_content(self.request.user, course):
            raise PermissionDenied(
                "Only administrators or assigned professors can enroll students."
            )

        serializer.save()


class TaskSubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TaskSubmission.objects.select_related(
            "academic_task",
            "academic_task__course",
            "student",
        )

        if is_admin_user(self.request.user):
            return queryset

        if is_professor_user(self.request.user):
            return queryset.filter(
                academic_task__course__professor_user=self.request.user,
            )

        return queryset.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    def perform_update(self, serializer):
        submission = self.get_object()
        course = submission.academic_task.course

        if not can_manage_course_content(self.request.user, course):
            raise PermissionDenied(
                "Only administrators or assigned professors can review submissions."
            )

        submission = serializer.save()
        submission.status = TaskSubmission.STATUS_REVIEWED
        submission.reviewed_at = timezone.now()
        submission.save(
            update_fields=[
                "status",
                "reviewed_at",
                "grade",
                "feedback",
            ]
        )

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
            .filter(is_deleted=False)
            .select_related("course", "task_type")
        )

        if is_professor_user(self.request.user):
            queryset = queryset.filter(
                course__professor_user=self.request.user,
            )
        elif not is_admin_user(self.request.user):
            queryset = queryset.filter(
                course__enrollments__student=self.request.user,
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
        course = serializer.validated_data["course"]

        if not can_manage_course_content(self.request.user, course):
            raise PermissionDenied(
                "Only administrators or assigned professors can create tasks."
            )

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
        if not can_manage_course_content(self.request.user, instance.course):
            raise PermissionDenied(
                "Only administrators or the assigned professor can delete tasks."
            )

        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save(update_fields=["is_deleted", "deleted_at", "updated_at"])

        TaskHistory.objects.create(
            academic_task=instance,
            user=self.request.user,
            action="deleted",
            description=f'Task "{instance.title}" was soft deleted.',
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
        courses = CourseViewSet()
        courses.request = request
        visible_courses = courses.get_queryset()

        tasks = (
            AcademicTask.objects
            .filter(course__in=visible_courses, is_deleted=False)
            .select_related("course", "task_type")
        )

        active_courses = visible_courses.filter(
            status=Course.STATUS_ACTIVE,
        ).count()

        pending_tasks = tasks.filter(status=AcademicTask.STATUS_PENDING).count()
        in_progress_tasks = tasks.filter(status=AcademicTask.STATUS_IN_PROGRESS).count()
        completed_tasks = tasks.filter(status=AcademicTask.STATUS_COMPLETED).count()

        overdue_tasks = (
            tasks.filter(due_date__lt=timezone.now())
            .exclude(status=AcademicTask.STATUS_COMPLETED)
            .count()
        )

        total_tasks = tasks.count()

        completion_rate = (
            round((completed_tasks / total_tasks) * 100, 2)
            if total_tasks > 0
            else 0
        )

        upcoming_tasks = tasks.order_by("due_date")[:5]

        serializer = DashboardSerializer(
            {
                "active_courses": active_courses,
                "pending_tasks": pending_tasks,
                "in_progress_tasks": in_progress_tasks,
                "completed_tasks": completed_tasks,
                "overdue_tasks": overdue_tasks,
                "completion_rate": completion_rate,
                "upcoming_tasks": upcoming_tasks,
            }
        )

        return Response(serializer.data)


class StatisticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses_view = CourseViewSet()
        courses_view.request = request
        courses = courses_view.get_queryset()

        tasks = AcademicTask.objects.filter(
            course__in=courses,
            is_deleted=False,
        )

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