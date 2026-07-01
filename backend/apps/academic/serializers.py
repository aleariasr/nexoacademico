from rest_framework import serializers

from .models import (
    AcademicTask,
    Course,
    CourseEnrollment,
    TaskAttachment,
    TaskHistory,
    TaskSubmission,
    TaskType,
)

class CourseSerializer(serializers.ModelSerializer):
    professor_username = serializers.CharField(
        source="professor_user.username",
        read_only=True,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "name",
            "code",
            "professor",
            "professor_user",
            "professor_username",
            "credits",
            "color",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(
        source="student.username",
        read_only=True,
    )
    student_email = serializers.EmailField(
        source="student.email",
        read_only=True,
    )
    course_name = serializers.CharField(
        source="course.name",
        read_only=True,
    )
    course_code = serializers.CharField(
        source="course.code",
        read_only=True,
    )

    class Meta:
        model = CourseEnrollment
        fields = [
            "id",
            "course",
            "course_name",
            "course_code",
            "student",
            "student_username",
            "student_email",
            "enrolled_at",
        ]
        read_only_fields = [
            "id",
            "course_name",
            "course_code",
            "student_username",
            "student_email",
            "enrolled_at",
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

        if course and user:
            is_admin = (
                user.is_staff
                or hasattr(user, "profile")
                and user.profile.role == "admin"
            )

            is_assigned_professor = course.professor_user_id == user.id

            if not is_admin and not is_assigned_professor:
                raise serializers.ValidationError(
                    {
                        "course": (
                            "Only administrators or the assigned professor can create tasks for this course."
                        )
                    }
                )
            
        if (
            status_value == AcademicTask.STATUS_COMPLETED
            and progress_percentage != 100
        ):
            data["progress_percentage"] = 100

        return data

class TaskSubmissionSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(
        source="academic_task.title",
        read_only=True,
    )
    course_name = serializers.CharField(
        source="academic_task.course.name",
        read_only=True,
    )
    student_username = serializers.CharField(
        source="student.username",
        read_only=True,
    )
    course = serializers.IntegerField(
        source="academic_task.course_id",
        read_only=True,
    )

    class Meta:
        model = TaskSubmission
        fields = [
            "id",
            "academic_task",
            "course",
            "task_title",
            "course_name",
            "student",
            "student_username",
            "comment",
            "file",
            "status",
            "grade",
            "feedback",
            "submitted_at",
            "reviewed_at",
        ]
        read_only_fields = [
            "id",
            "task_title",
            "course_name",
            "student",
            "student_username",
            "status",
            "submitted_at",
            "reviewed_at",
        ]

    def validate(self, data):
        request = self.context.get("request")
        user = request.user if request else None
        academic_task = data.get("academic_task")

        if user and academic_task:
            is_enrolled = academic_task.course.enrollments.filter(
                student=user,
            ).exists()

            if not is_enrolled:
                raise serializers.ValidationError(
                    {
                        "academic_task": (
                            "You can only submit work for tasks assigned to your courses."
                        )
                    }
                )

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