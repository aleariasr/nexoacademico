from django.core.management.base import BaseCommand

from apps.academic.models import TaskType


class Command(BaseCommand):
    help = "Seed default academic task types."

    def handle(self, *args, **options):
        task_types = [
            {
                "name": "Task",
                "description": "Regular academic assignment or homework.",
            },
            {
                "name": "Exam",
                "description": "Written, oral, or practical course evaluation.",
            },
            {
                "name": "Project",
                "description": "Individual or group academic project.",
            },
            {
                "name": "Reading",
                "description": "Assigned reading or study material.",
            },
            {
                "name": "Event",
                "description": "Academic event, class activity, or important date.",
            },
            {
                "name": "Reminder",
                "description": "General academic reminder.",
            },
        ]

        created_count = 0
        updated_count = 0

        for task_type_data in task_types:
            _, created = TaskType.objects.update_or_create(
                name=task_type_data["name"],
                defaults={
                    "description": task_type_data["description"],
                },
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Task types seeded successfully. "
                f"Created: {created_count}. Updated: {updated_count}."
            )
        )