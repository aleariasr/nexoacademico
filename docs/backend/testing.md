# Pruebas del Backend

## Objetivo

Verificar el correcto funcionamiento de la API REST de NexoAcadémico mediante pruebas manuales utilizando curl y consultas directas a la base de datos.

---

# Ambiente de Pruebas

## Backend

- Django 6
- Django REST Framework

## Base de Datos

- MySQL
- phpMyAdmin

## Cliente de pruebas

- curl
- Navegador Web
- Django Admin

---

# Caso 1: Registro de Usuario

## Solicitud

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/register/ \
-H "Content-Type: application/json" \
-d '{
  "username":"student_demo",
  "first_name":"Student",
  "last_name":"Demo",
  "email":"student@nexoacademico.com",
  "password":"Student12345",
  "password_confirm":"Student12345"
}'
```

## Resultado esperado

- Usuario creado
- Token generado
- Perfil asociado

## Resultado obtenido

Correcto.

---

# Caso 2: Acceso sin autenticación

## Solicitud

```bash
curl http://127.0.0.1:8000/api/v1/courses/
```

## Resultado esperado

```json
{
  "detail":"Las credenciales de autenticación no se proveyeron."
}
```

## Resultado obtenido

Correcto.

---

# Caso 3: Creación de Curso

## Solicitud

```bash
curl -X POST http://127.0.0.1:8000/api/v1/courses/ \
-H "Authorization: Token TOKEN" \
-H "Content-Type: application/json"
```

## Resultado esperado

- Curso creado
- Asociado al usuario autenticado

## Resultado obtenido

Correcto.

---

# Caso 4: Consulta de Cursos

## Solicitud

```bash
curl http://127.0.0.1:8000/api/v1/courses/ \
-H "Authorization: Token TOKEN"
```

## Resultado esperado

Lista de cursos del usuario.

## Resultado obtenido

Correcto.

---

# Caso 5: Seed de Tipos de Tarea

## Solicitud

```bash
python manage.py seed_task_types
```

## Resultado esperado

Creación de:

- Task
- Exam
- Project
- Reading
- Event
- Reminder

## Resultado obtenido

Correcto.

---

# Caso 6: Creación de Tarea

## Solicitud

```bash
curl -X POST http://127.0.0.1:8000/api/v1/tasks/
```

## Resultado esperado

- Tarea creada
- Historial creado automáticamente

## Resultado obtenido

Correcto.

---

# Caso 7: Actualización de Tarea

## Solicitud

```bash
PATCH /tasks/{id}/
```

## Resultado esperado

- Estado actualizado
- Registro agregado en TaskHistory

## Resultado obtenido

Correcto.

---

# Caso 8: Eliminación Lógica

## Solicitud

```bash
DELETE /tasks/{id}/
```

## Resultado esperado

```text
is_deleted = true
deleted_at != null
```

## Resultado obtenido

Correcto.

---

# Caso 9: Dashboard

## Endpoint

```http
GET /dashboard/
```

## Validaciones

- Cursos activos
- Tareas pendientes
- Tareas completadas
- Próximas tareas
- Tasa de finalización

## Resultado obtenido

Correcto.

---

# Caso 10: Historial de Tareas

## Endpoint

```http
GET /tasks/{id}/history/
```

## Resultado esperado

Listado cronológico de cambios.

## Resultado obtenido

Correcto.

---

# Caso 11: Filtro por Estado

## Endpoint

```http
GET /tasks/?status=pending
```

## Resultado obtenido

Correcto.

---

# Caso 12: Filtro por Prioridad

## Endpoint

```http
GET /tasks/?priority=high
```

## Resultado obtenido

Correcto.

---

# Caso 13: Filtro por Curso

## Endpoint

```http
GET /tasks/?course=1
```

## Resultado obtenido

Correcto.

---

# Caso 14: Filtro por Vencimiento

## Endpoint

```http
GET /tasks/?overdue=true
```

## Resultado obtenido

Correcto.

---

# Caso 15: Búsqueda

## Endpoint

```http
GET /tasks/?search=backup
```

## Resultado obtenido

Correcto.

---

# Caso 16: Paginación

## Endpoint

```http
GET /tasks/?page=1
```

## Resultado obtenido

Correcto.

---

# Caso 17: Stored Procedure Dashboard

## Procedimiento

```sql
CALL sp_get_user_dashboard(2);
```

## Resultado esperado

- Cursos activos
- Tareas pendientes
- Tareas completadas
- Tareas vencidas

## Resultado obtenido

Correcto.

---

# Caso 18: Stored Procedure Summary

## Procedimiento

```sql
CALL sp_get_user_task_summary(2);
```

## Resultado esperado

Resumen agrupado por:

- Estado
- Prioridad

## Resultado obtenido

Correcto.

---

# Resultado General

Todos los endpoints implementados fueron probados exitosamente.

Se verificó:

- Autenticación
- Seguridad
- CRUD de cursos
- CRUD de tareas
- Historial
- Soft Delete
- Dashboard
- Estadísticas
- Filtros
- Búsquedas
- Paginación
- Procedimientos almacenados

Estado final:

APROBADO