# Modelo de datos

## Entidades principales

- `User`: cuenta base de Django.
- `UserProfile`: rol, teléfono, carrera y fecha de creación.
- `Course`: curso, profesor asignado, créditos, color y estado.
- `CourseEnrollment`: relación única entre curso y estudiante.
- `TaskType`: catálogo de tipos de actividad.
- `AcademicTask`: actividad, fecha límite, prioridad, estado, progreso, peso y nota.
- `TaskSubmission`: entrega única por estudiante y actividad.
- `TaskAttachment`: archivos asociados a actividades.
- `TaskHistory`: auditoría de cambios.

## Relaciones

```text
User 1 ── 1 UserProfile
User 1 ── N Course              (propietario administrativo)
User 1 ── N Course              (profesor asignado)
Course 1 ── N CourseEnrollment
User 1 ── N CourseEnrollment
Course 1 ── N AcademicTask
TaskType 1 ── N AcademicTask
AcademicTask 1 ── N TaskSubmission
User 1 ── N TaskSubmission
AcademicTask 1 ── N TaskAttachment
AcademicTask 1 ── N TaskHistory
```

## Restricciones relevantes

- Código de curso único por propietario.
- Una matrícula por combinación curso-estudiante.
- Una entrega por combinación actividad-estudiante.
- Progreso entre 0 y 100.
- `TaskType.name` único.

## Observación

Los procedimientos almacenados existentes fueron escritos para un modelo anterior basado directamente en `user_id`. Deben revisarse antes de documentarlos como parte funcional del sistema actual basado en roles, profesor asignado y matrículas.
