# NexoAcadémico

Plataforma web full stack para la gestión de cursos, actividades académicas, entregas y seguimiento del progreso universitario. El sistema implementa acceso basado en roles para administradores, profesores y estudiantes mediante una API REST en Django y una interfaz moderna construida con Next.js.

> Proyecto académico desarrollado para el curso **Lenguajes para Aplicaciones Comerciales** de la Universidad de Costa Rica.

<p align="center">
  <img src="docs/assets/screenshots/dashboard-admin.png" alt="Dashboard de NexoAcadémico" width="900">
</p>

## Características principales

- Autenticación por token y registro de estudiantes.
- Roles diferenciados: administrador, profesor y estudiante.
- Administración de usuarios por parte del rol administrador.
- Creación y asignación de cursos.
- Matrícula de estudiantes en cursos.
- Gestión de actividades con prioridad, estado, progreso, fecha límite, peso y calificación.
- Búsqueda, filtros y ordenamiento de actividades.
- Entrega de archivos y comentarios por estudiantes.
- Revisión, retroalimentación y calificación de entregas.
- Dashboard con indicadores académicos y próximas actividades.
- Estadísticas de rendimiento y carga académica.
- Eliminación lógica y trazabilidad mediante historial de actividades.
- Interfaz adaptable con sistema visual inspirado en materiales translúcidos y animaciones.

## Capturas

| Autenticación | Dashboard |
|---|---|
| ![Inicio de sesión](docs/assets/screenshots/login.png) | ![Dashboard](docs/assets/screenshots/dashboard-admin.png) |

| Cursos | Detalle del curso |
|---|---|
| ![Cursos](docs/assets/screenshots/courses.png) | ![Detalle del curso](docs/assets/screenshots/course-detail-professor.png) |

| Actividades | Entregas |
|---|---|
| ![Actividades](docs/assets/screenshots/tasks.png) | ![Entregas](docs/assets/screenshots/submissions-review.png) |

Consulta la [guía de capturas](docs/SCREENSHOTS.md) para producir todas las imágenes con dimensiones, datos y nombres consistentes.

## Arquitectura

```text
Browser
   |
   v
Next.js 16 + React 19
   |
   | HTTP / JSON + Token Authentication
   v
Django 6 + Django REST Framework
   |
   v
MySQL
```

```text
nexoacademico/
├── backend/
│   ├── apps/
│   │   ├── accounts/          # Autenticación y administración de usuarios
│   │   └── academic/          # Cursos, actividades, matrículas y entregas
│   ├── config/                # Configuración principal de Django
│   ├── database/              # Procedimientos almacenados
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/               # Rutas de Next.js App Router
│   │   ├── components/        # UI, navegación, cursos y actividades
│   │   ├── lib/               # Cliente API, constantes y motion tokens
│   │   ├── services/          # Servicios de autenticación y dominio
│   │   ├── styles/            # Tokens, glass material y animaciones
│   │   └── types/             # Tipos TypeScript
│   └── package.json
└── docs/                      # Documentación técnica
```

Más detalle en [Arquitectura](docs/architecture.md).

## Tecnologías

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React

### Backend

- Python
- Django 6
- Django REST Framework
- Token Authentication
- django-cors-headers
- PyMySQL
- Pillow

### Base de datos

- MySQL con codificación `utf8mb4`
- Migraciones administradas por Django ORM
- Restricciones únicas, índices y relaciones con integridad referencial

## Requisitos

- Python 3.12 o superior
- Node.js 20 o superior
- npm 10 o superior
- MySQL 8

## Instalación local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd nexoacademico
```

### 2. Configurar el backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

En Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Configura `backend/.env`:

```env
SECRET_KEY=replace-with-a-secure-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=nexoacademico_db
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=127.0.0.1
DB_PORT=3306
```

Crea la base de datos:

```sql
CREATE DATABASE nexoacademico_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Ejecuta migraciones y carga el catálogo inicial:

```bash
python manage.py migrate
python manage.py seed_task_types
python manage.py createsuperuser
python manage.py runserver
```

El backend estará disponible en `http://127.0.0.1:8000`.

### 3. Configurar el frontend

```bash
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

Configura `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

La interfaz estará disponible en `http://localhost:3000`.

## Roles y permisos

| Función | Administrador | Profesor | Estudiante |
|---|:---:|:---:|:---:|
| Administrar usuarios | Sí | No | No |
| Crear cursos | Sí | No | No |
| Ver cursos asignados | Sí | Sí | Sí |
| Matricular estudiantes | Sí | Sí, en sus cursos | No |
| Crear actividades | Sí | Sí, en sus cursos | No |
| Entregar actividades | No | No | Sí |
| Revisar y calificar entregas | Sí | Sí, en sus cursos | No |
| Consultar dashboard y estadísticas | Sí | Sí | Sí |

## API

La API utiliza el prefijo:

```text
/api/v1/
```

Ejemplo de autenticación:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"your-password"}'
```

Las solicitudes autenticadas deben enviar:

```http
Authorization: Token YOUR_TOKEN
```

Principales recursos:

| Recurso | Ruta |
|---|---|
| Autenticación | `/api/v1/auth/` |
| Cursos | `/api/v1/courses/` |
| Matrículas | `/api/v1/enrollments/` |
| Tipos de actividad | `/api/v1/task-types/` |
| Actividades | `/api/v1/tasks/` |
| Entregas | `/api/v1/submissions/` |
| Dashboard | `/api/v1/dashboard/` |
| Estadísticas | `/api/v1/statistics/` |

Consulta [Referencia de la API](docs/api.md).

## Calidad y verificación

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
python manage.py check
python manage.py test
```

> Antes de publicar el repositorio, regenera `package-lock.json` con `npm install` y confirma que `npm ci`, `npm run lint` y `npm run build` terminan correctamente.

## Seguridad

- Las credenciales y secretos se cargan mediante variables de entorno.
- Los archivos `.env` no deben versionarse.
- La API exige autenticación de forma predeterminada.
- Los querysets se filtran según el rol y la relación del usuario con el curso.
- Las actividades se eliminan de forma lógica para conservar trazabilidad.
- Los archivos cargados en `backend/media/` son datos de ejecución y no deben incluirse en Git.

Consulta [Seguridad y configuración](docs/security.md).

## Documentación

- [Arquitectura](docs/architecture.md)
- [Instalación y configuración](docs/setup.md)
- [Referencia de la API](docs/api.md)
- [Modelo de datos](docs/database.md)
- [Guía de capturas](docs/SCREENSHOTS.md)

## Estado del proyecto

Proyecto académico funcional. Las mejoras recomendadas antes de considerarlo listo para producción incluyen pruebas automatizadas, documentación OpenAPI, almacenamiento externo de archivos, rotación o expiración de tokens y configuración separada por ambiente.

## Licencia

Este proyecto se distribuye con fines académicos. Añade un archivo `LICENSE` antes de permitir reutilización pública del código.
