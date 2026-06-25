from rest_framework import serializers

from .models import (
    AcademicTask,
    Course,
    TaskAttachment,
    TaskHistory,
    TaskType,
)


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "name",
            "code",
            "professor",
            "credits",
            "color",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


class TaskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskType
        fields = [
            "id",
            "name",
            "description",
        ]
        read_only_fields = [
            "id",
        ]


class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = [
            "id",
            "file",
            "original_name",
            "uploaded_at",
        ]
        read_only_fields = [
            "id",
            "uploaded_at",
        ]


class AcademicTaskSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(
        source="course.name",
        read_only=True,
    )
    task_type_name = serializers.CharField(
        source="task_type.name",
        read_only=True,
    )
    is_overdue = serializers.BooleanField(
        read_only=True,
    )

    class Meta:
        model = AcademicTask
        fields = [
            "id",
            "course",
            "course_name",
            "task_type",
            "task_type_name",
            "title",
            "description",
            "due_date",
            "priority",
            "status",
            "progress_percentage",
            "reminder_at",
            "weight_percentage",
            "grade",
            "is_overdue",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "course_name",
            "task_type_name",
            "is_overdue",
            "created_at",
            "updated_at",
        ]

    def validate_progress_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Progress percentage must be between 0 and 100."
            )

        return value

    def validate(self, data):
        request = self.context.get("request")
        user = request.user if request else None

        course = data.get("course")
        status_value = data.get("status")
        progress_percentage = data.get("progress_percentage")

        if course and user and course.user_id != user.id:
            raise serializers.ValidationError(
                {
                    "course": (
                        "This course does not belong to the authenticated user."
                    )
                }
            )

        if (
            status_value == AcademicTask.STATUS_COMPLETED
            and progress_percentage != 100
        ):
            data["progress_percentage"] = 100

        return data


class DashboardSerializer(serializers.Serializer):
    active_courses = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    in_progress_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    upcoming_tasks = AcademicTaskSerializer(
        many=True,
        read_only=True,
    )


class TaskHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskHistory
        fields = [
            "id",
            "action",
            "description",
            "created_at",
        ]
        read_only_fields = fields