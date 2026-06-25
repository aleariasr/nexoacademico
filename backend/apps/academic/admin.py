from django.contrib import admin

from .models import (
    AcademicTask,
    Course,
    TaskAttachment,
    TaskHistory,
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