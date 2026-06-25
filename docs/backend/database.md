# Diseño de Base de Datos

## Descripción General

La base de datos de NexoAcadémico utiliza MySQL como sistema gestor de bases de datos relacional.

Su objetivo es almacenar de forma segura la información académica de cada usuario, incluyendo cursos, tareas, historial de cambios, estadísticas y configuraciones de perfil.

---

# Modelo Entidad Relación

## Entidades Principales

### User

Tabla administrada por Django Authentication.

Almacena:

- Usuario
- Contraseña cifrada
- Correo electrónico
- Estado de la cuenta

Relación:

- 1 → 1 UserProfile
- 1 → N Course
- 1 → N AcademicTask
- 1 → N TaskHistory

---

### UserProfile

Información complementaria del usuario.

Campos:

| Campo | Tipo |
|---------|---------|
| id | PK |
| user_id | FK |
| role | VARCHAR(20) |
| phone | VARCHAR(20) |
| degree_program | VARCHAR(120) |
| created_at | DATETIME |

---

### Course

Representa un curso académico.

Campos:

| Campo | Tipo |
|---------|---------|
| id | PK |
| user_id | FK |
| name | VARCHAR(120) |
| code | VARCHAR(20) |
| professor | VARCHAR(120) |
| credits | SMALLINT |
| color | VARCHAR(20) |
| status | VARCHAR(20) |
| created_at | DATETIME |

Restricciones:

- UNIQUE(user_id, code)

Estados:

- active
- completed

---

### TaskType

Catálogo de tipos de tarea.

Campos:

| Campo | Tipo |
|---------|---------|
| id | PK |
| name | VARCHAR(80) |
| description | TEXT |

Tipos iniciales:

- Task
- Exam
- Project
- Reading
- Event
- Reminder

---

### AcademicTask

Entidad central del sistema.

Campos:

| Campo | Tipo |
|---------|---------|
| id | PK |
| user_id | FK |
| course_id | FK |
| task_type_id | FK |
| title | VARCHAR(160) |
| description | TEXT |
| due_date | DATETIME |
| priority | VARCHAR(20) |
| status | VARCHAR(20) |
| progress_percentage | SMALLINT |
| reminder_at | DATETIME |
| weight_percentage | DECIMAL(5,2) |
| grade | DECIMAL(5,2) |
| is_deleted | BOOLEAN |
| deleted_at | DATETIME |
| created_at | DATETIME |
| updated_at | DATETIME |

Prioridades:

- low
- medium
- high
- critical

Estados:

- pending
- in_progress
- completed
- cancelled

---

### TaskAttachment

Archivos adjuntos asociados a una tarea.

Campos:

| Campo | Tipo |
|---------|---------|
| id | PK |
| academic_task_id | FK |
| file | FILE |
| original_name | VARCHAR(255) |
| uploaded_at | DATETIME |

---

### TaskHistory

Bitácora de auditoría.

Campos:

| Campo | Tipo |
|---------|---------|
| id | PK |
| academic_task_id | FK |
| user_id | FK |
| action | VARCHAR(80) |
| description | TEXT |
| created_at | DATETIME |

Eventos registrados:

- created
- updated
- deleted

---

# Relaciones

User
└── UserProfile (1:1)

User
└── Course (1:N)

User
└── AcademicTask (1:N)

Course
└── AcademicTask (1:N)

TaskType
└── AcademicTask (1:N)

AcademicTask
└── TaskAttachment (1:N)

AcademicTask
└── TaskHistory (1:N)

---

# Índices

AcademicTask

- (user_id, status)
- (user_id, due_date)
- (user_id, priority)
- (user_id, is_deleted)

Objetivo:

- Optimizar dashboard
- Optimizar filtros
- Optimizar búsquedas frecuentes

---

# Eliminación Lógica

Las tareas no son eliminadas físicamente.

Campos utilizados:

- is_deleted
- deleted_at

Cuando una tarea es eliminada:

is_deleted = true

La información permanece disponible para auditoría.

---

# Integridad Referencial

Course → User

ON DELETE CASCADE

AcademicTask → Course

ON DELETE CASCADE

AcademicTask → User

ON DELETE CASCADE

TaskAttachment → AcademicTask

ON DELETE CASCADE

TaskHistory → AcademicTask

ON DELETE CASCADE

TaskType → AcademicTask

ON DELETE PROTECT

Esto evita eliminar tipos de tarea utilizados por registros existentes.

---

# Procedimientos Almacenados

## sp_get_user_dashboard

Obtiene indicadores principales para un usuario.

Retorna:

- Cursos activos
- Tareas pendientes
- Tareas en progreso
- Tareas completadas
- Tareas vencidas

---

## sp_get_user_task_summary

Obtiene resumen agrupado por:

- Estado
- Prioridad

---

## sp_soft_delete_task

Realiza eliminación lógica de una tarea.

Actualiza:

- is_deleted
- deleted_at
- updated_at