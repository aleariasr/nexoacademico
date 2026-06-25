# API REST

## Información General

La API de NexoAcadémico fue desarrollada utilizando Django REST Framework siguiendo principios RESTful.

Todas las rutas protegidas requieren autenticación mediante Token Authentication.

Base URL:

```text
http://127.0.0.1:8000/api/v1/
```

---

# Autenticación

## Registro de Usuario

### Endpoint

```http
POST /auth/register/
```

### Request

```json
{
  "username": "student_demo",
  "first_name": "Student",
  "last_name": "Demo",
  "email": "student@nexoacademico.com",
  "password": "Student12345",
  "password_confirm": "Student12345"
}
```

### Response

```json
{
  "token": "TOKEN_GENERADO",
  "user": {
    "id": 2,
    "username": "student_demo",
    "first_name": "Student",
    "last_name": "Demo",
    "email": "student@nexoacademico.com",
    "role": "student",
    "degree_program": ""
  }
}
```

---

# Cursos

## Listar Cursos

### Endpoint

```http
GET /courses/
```

### Header

```http
Authorization: Token TOKEN_GENERADO
```

---

## Crear Curso

### Endpoint

```http
POST /courses/
```

### Request

```json
{
  "name": "Database Administration",
  "code": "IF5100",
  "professor": "Luis Diego Bolaños",
  "credits": 4,
  "color": "#2563eb",
  "status": "active"
}
```

### Response

```json
{
  "id": 1,
  "name": "Database Administration",
  "code": "IF5100",
  "professor": "Luis Diego Bolaños",
  "credits": 4,
  "color": "#2563eb",
  "status": "active"
}
```

---

# Tipos de Tarea

## Listar Tipos

### Endpoint

```http
GET /task-types/
```

### Response

```json
[
  {
    "id": 1,
    "name": "Task"
  },
  {
    "id": 2,
    "name": "Exam"
  }
]
```

---

# Tareas

## Crear Tarea

### Endpoint

```http
POST /tasks/
```

### Request

```json
{
  "course": 1,
  "task_type": 1,
  "title": "Database Backup Practice",
  "description": "Practice backup and restore strategy.",
  "due_date": "2026-07-03T18:00:00-06:00",
  "priority": "high",
  "status": "pending",
  "progress_percentage": 0,
  "weight_percentage": "10.00"
}
```

---

## Listar Tareas

### Endpoint

```http
GET /tasks/
```

### Response

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [...]
}
```

---

## Actualizar Tarea

### Endpoint

```http
PATCH /tasks/{id}/
```

### Request

```json
{
  "status": "in_progress",
  "progress_percentage": 45
}
```

---

## Eliminar Tarea

### Endpoint

```http
DELETE /tasks/{id}/
```

### Comportamiento

La tarea no se elimina físicamente.

Se actualizan:

```text
is_deleted = true
deleted_at = NOW()
```

---

# Historial de Tareas

## Obtener Historial

### Endpoint

```http
GET /tasks/{id}/history/
```

### Response

```json
[
  {
    "id": 1,
    "action": "created",
    "description": "Task \"Database Backup Practice\" was created."
  }
]
```

---

# Dashboard

## Obtener Dashboard

### Endpoint

```http
GET /dashboard/
```

### Response

```json
{
  "active_courses": 1,
  "pending_tasks": 1,
  "in_progress_tasks": 0,
  "completed_tasks": 0,
  "overdue_tasks": 0,
  "completion_rate": 0.0,
  "upcoming_tasks": [...]
}
```

---

# Statistics

## Obtener Estadísticas

### Endpoint

```http
GET /statistics/
```

### Response

```json
{
  "total_courses": 1,
  "active_courses": 1,
  "total_active_credits": 4,
  "total_tasks": 1,
  "completed_tasks": 0,
  "pending_tasks": 1,
  "in_progress_tasks": 0,
  "high_priority_tasks": 1,
  "completion_rate": 0.0,
  "average_grade": null
}
```

---

# Filtros

## Filtrar por Estado

```http
GET /tasks/?status=pending
```

## Filtrar por Prioridad

```http
GET /tasks/?priority=high
```

## Filtrar por Curso

```http
GET /tasks/?course=1
```

## Filtrar por Vencidas

```http
GET /tasks/?overdue=true
```

---

# Búsqueda

```http
GET /tasks/?search=backup
```

Busca coincidencias en:

- title
- description

---

# Paginación

### Ejemplo

```http
GET /tasks/?page=1
```

### Respuesta

```json
{
  "count": 25,
  "next": "...",
  "previous": null,
  "results": [...]
}
```

---

# Seguridad

La API utiliza:

```text
Token Authentication
```

Cada usuario únicamente puede acceder a:

- Sus cursos
- Sus tareas
- Su historial
- Sus estadísticas

La segregación se implementa mediante filtros sobre el usuario autenticado.