# Referencia resumida de la API

Base URL local:

```text
http://127.0.0.1:8000/api/v1
```

## Autenticación

| Método | Ruta | Uso |
|---|---|---|
| POST | `/auth/register/` | Crear una cuenta de estudiante |
| POST | `/auth/login/` | Obtener token y datos del usuario |
| GET | `/auth/me/` | Consultar sesión autenticada |
| GET | `/auth/users/` | Listar usuarios, opcionalmente por rol |
| CRUD | `/auth/manage-users/` | Administración restringida a administradores |

## Recursos académicos

| Método | Ruta | Uso |
|---|---|---|
| CRUD | `/courses/` | Cursos visibles según rol |
| GET | `/task-types/` | Catálogo de tipos de actividad |
| CRUD | `/tasks/` | Actividades académicas |
| GET | `/tasks/{id}/history/` | Historial de una actividad |
| CRUD | `/enrollments/` | Matrículas |
| CRUD | `/submissions/` | Entregas y revisiones |
| GET | `/dashboard/` | Indicadores y próximas actividades |
| GET | `/statistics/` | Estadísticas académicas |

## Filtros de actividades

- `search`
- `status`
- `priority`
- `course`
- `overdue=true`
- `ordering=due_date`

## Encabezado de autenticación

```http
Authorization: Token YOUR_TOKEN
```

Para una referencia completa y mantenible, añade `drf-spectacular` y publica un esquema OpenAPI con Swagger UI.
