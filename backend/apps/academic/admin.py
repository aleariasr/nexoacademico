from django.contrib import admin

from .models import (
    AcademicTask,
    Course,
    CourseEnrollment,
    TaskAttachment,
    TaskHistory,
    TaskSubmission,
    TaskType,
    UserProfile,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "role",
        "degree_program",
        "created_at",
    )
    search_fields = (
        "user__username",
        "user__email",
        "degree_program",
    )
    list_filter = (
        "role",
    )
    readonly_fields = (
        "created_at",
    )


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "name",
        "user",
        "professor",
        "credits",
        "status",
        "created_at",
    )
    search_fields = (
        "code",
        "name",
        "professor",
        "user__username",
    )
    list_filter = (
        "status",
        "credits",
    )
    readonly_fields = (
        "created_at",
    )

@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = (
        "course",
        "student",
        "enrolled_at",
    )
    search_fields = (
        "course__name",
        "course__code",
        "student__username",
        "student__email",
    )
    list_filter = (
        "course",
    )
    readonly_fields = (
        "enrolled_at",
    )

@admin.register(TaskType)
class TaskTypeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "description",
    )
    search_fields = (
        "name",
        "description",
    )


@admin.register(AcademicTask)
class AcademicTaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "user",
        "course",
        "task_type",
        "priority",
        "status",
        "progress_percentage",
        "due_date",
        "is_deleted",
    )
    list_filter = (
        "priority",
        "status",
        "task_type",
        "is_deleted",
    )
    search_fields = (
        "title",
        "description",
        "course__name",
        "course__code",
        "user__username",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
        "deleted_at",
    )
    date_hierarchy = "due_date"

@admin.register(TaskSubmission)
class TaskSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "academic_task",
        "student",
        "status",
        "grade",
        "submitted_at",
        "reviewed_at",
    )
    search_fields = (
        "academic_task__title",
        "academic_task__course__name",
        "student__username",
        "comment",
        "feedback",
    )
    list_filter = (
        "status",
        "academic_task__course",
    )
    readonly_fields = (
        "submitted_at",
        "reviewed_at",
    )

@admin.register(TaskAttachment)
class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = (
        "original_name",
        "academic_task",
        "uploaded_at",
    )
    search_fields = (
        "original_name",
        "academic_task__title",
    )
    readonly_fields = (
        "uploaded_at",
    )


@admin.register(TaskHistory)
class TaskHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "academic_task",
        "user",
        "action",
        "created_at",
    )
    search_fields = (
        "action",
        "description",
        "academic_task__title",
        "user__username",
    )
    list_filter = (
        "action",
    )
    readonly_fields = (
        "academic_task",
        "user",
        "action",
        "description",
        "created_at",
    )