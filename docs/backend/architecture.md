# Arquitectura del Backend

## Descripción General

El backend de NexoAcadémico fue desarrollado utilizando Django y Django REST Framework bajo una arquitectura basada en API REST.

Su propósito es administrar la lógica de negocio relacionada con cursos académicos, tareas, seguimiento de progreso, estadísticas y autenticación de usuarios.

---

## Tecnologías Utilizadas

### Framework

- Django 6
- Django REST Framework

### Base de Datos

- MySQL

### Autenticación

- Token Authentication

### Lenguaje

- Python 3.14

---

## Arquitectura Lógica

Cliente

↓

API REST (Django REST Framework)

↓

Servicios de Aplicación

↓

Modelos Django

↓

MySQL

---

## Módulos Principales

### Authentication

Responsable de:

- Registro de usuarios
- Inicio de sesión
- Emisión de tokens
- Gestión de perfiles

---

### Academic

Responsable de:

- Cursos
- Tareas académicas
- Tipos de tareas
- Archivos adjuntos
- Historial de cambios

---

### Dashboard

Responsable de:

- Indicadores académicos
- Próximas tareas
- Resumen de progreso

---

### Statistics

Responsable de:

- Métricas académicas
- Rendimiento general
- Créditos activos
- Tasas de finalización

---

## Seguridad

Todas las operaciones requieren autenticación mediante token.

Cada usuario únicamente puede acceder a:

- Sus cursos
- Sus tareas
- Su historial
- Sus estadísticas

La separación se realiza mediante filtros por usuario autenticado.

---

## Eliminación Lógica

Las tareas utilizan Soft Delete.

Campos utilizados:

- is_deleted
- deleted_at

Las tareas eliminadas permanecen en la base de datos para auditoría e historial.

---

## Historial de Cambios

Cada modificación genera un registro en TaskHistory.

Eventos registrados:

- created
- updated
- deleted

Esto permite trazabilidad completa de las operaciones realizadas sobre una tarea.