# Guía de capturas para GitHub

Guarda todas las imágenes en:

```text
docs/assets/screenshots/
```

Usa PNG, navegador sin marcadores visibles, zoom al 100 %, datos ficticios y la misma resolución para todas las capturas de escritorio.

## Configuración recomendada

- Escritorio: `1440 × 900 px`.
- Móvil: `390 × 844 px`.
- Tema: el tema visual predeterminado del proyecto.
- Sidebar: expandido en las capturas generales y contraído solo en la captura destinada a mostrar ese estado.
- Datos: utiliza nombres genéricos. No muestres correos, archivos o información real de estudiantes.
- Evita capturar DevTools, barra de descargas, notificaciones o extensiones del navegador.

## Capturas obligatorias

| Archivo | Rol | Pantalla y estado que debe mostrar |
|---|---|---|
| `login.png` | Público | Formulario de inicio de sesión centrado, campos vacíos y fondo completo. |
| `register.png` | Público | Formulario de registro con todos los campos visibles. |
| `dashboard-admin.png` | Administrador | Indicadores con datos, próximos trabajos y cursos administrados. Esta será la imagen principal del README. |
| `dashboard-student.png` | Estudiante | Cursos matriculados, tareas pendientes y próximas fechas. |
| `users-admin.png` | Administrador | Grupos de administradores, profesores y estudiantes, con botón para crear usuario. |
| `courses.png` | Administrador | Cuadrícula con al menos cuatro cursos y barra de búsqueda. |
| `course-create-modal.png` | Administrador | Modal para crear o editar un curso, completamente visible. |
| `course-detail-professor.png` | Profesor | Encabezado del curso, información general, tareas y alumnos matriculados. |
| `course-enroll-student.png` | Profesor | Modal de matrícula con selector de estudiante. |
| `tasks.png` | Profesor | Actividades con distintas prioridades y estados, filtros visibles. |
| `task-create-modal.png` | Profesor | Formulario de actividad con fecha, prioridad, tipo y progreso. |
| `submissions-student.png` | Estudiante | Lista de entregas y acción para subir trabajo. |
| `submission-upload.png` | Estudiante | Modal de entrega con comentario y selector de archivo. Usa un archivo ficticio. |
| `submissions-review.png` | Profesor | Entregas pendientes y revisadas. |
| `submission-review-modal.png` | Profesor | Modal con nota y retroalimentación. No muestres datos reales. |
| `statistics.png` | Cualquier rol con datos | Resumen de finalización, carga académica y métricas disponibles. |
| `profile.png` | Estudiante | Perfil completo con datos ficticios. |
| `settings.png` | Estudiante | Configuración de cuenta. |
| `mobile-dashboard.png` | Estudiante | Dashboard a 390 × 844 px con navegación inferior visible. |

## Capturas opcionales de alto valor

- `sidebar-collapsed.png`: estado contraído del sidebar.
- `empty-state.png`: pantalla sin actividades para demostrar el tratamiento de estados vacíos.
- `loading-state.png`: captura o GIF corto de un estado de carga.
- `task-filters.png`: búsqueda y filtros aplicados.
- `soft-delete-history.png`: respuesta de Postman o panel mostrando historial de cambios.
- `django-admin.png`: panel administrativo, únicamente si aporta valor y no revela datos sensibles.

## Datos de demostración sugeridos

Cursos:

- IF4101 · Lenguajes para Aplicaciones Comerciales
- IF5100 · Administración de Bases de Datos
- IF5000 · Redes y Comunicaciones de Datos
- MA0323 · Métodos Numéricos

Actividades:

- Proyecto final de aplicación web
- Examen II de bases de datos
- Informe técnico de Wi-Fi 7
- Práctica de métodos Runge-Kutta

Estados y prioridades:

- Incluye al menos una actividad pendiente, una en progreso y una completada.
- Incluye prioridades baja, media, alta y crítica.
- Usa fechas cercanas pero ficticias.

## Uso en Markdown

```md
![Dashboard administrativo](docs/assets/screenshots/dashboard-admin.png)
```

Para dos capturas en paralelo:

```html
<table>
  <tr>
    <td><img src="docs/assets/screenshots/login.png" alt="Inicio de sesión"></td>
    <td><img src="docs/assets/screenshots/dashboard-admin.png" alt="Dashboard"></td>
  </tr>
</table>
```

## Reglas de privacidad

No subas:

- Entregas reales de estudiantes.
- Nombres completos, correos, carnés o números telefónicos reales.
- Tokens de autenticación.
- Contraseñas o variables de entorno.
- Rutas locales del equipo.
- Capturas con datos de la base de datos que no sean ficticios.
