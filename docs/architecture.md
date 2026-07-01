# Arquitectura

NexoAcadémico utiliza una arquitectura cliente-servidor desacoplada. Next.js consume una API REST implementada con Django REST Framework. La persistencia se administra mediante Django ORM sobre MySQL.

## Capas

1. **Presentación:** rutas de Next.js, componentes reutilizables, navegación adaptable y animaciones.
2. **Servicios del frontend:** encapsulan las solicitudes HTTP y el manejo de la sesión local.
3. **API REST:** autenticación, autorización, serialización, validaciones y reglas de negocio.
4. **Dominio y persistencia:** modelos, restricciones, índices, migraciones y relaciones.

## Módulos del backend

- `accounts`: registro, login, consulta del usuario autenticado y administración de cuentas.
- `academic`: perfiles, cursos, matrículas, tipos de actividad, actividades, entregas e historial.

## Control de acceso

- Administrador: administra usuarios y cursos, y puede consultar todos los datos académicos.
- Profesor: consulta sus cursos, matricula estudiantes, crea actividades y revisa entregas.
- Estudiante: consulta cursos matriculados, actividades y sus propias entregas.

## Decisiones relevantes

- Token Authentication para una integración simple entre clientes desacoplados.
- Soft delete en actividades para conservar auditoría.
- `TaskHistory` para registrar creación, actualización y eliminación lógica.
- Índices compuestos orientados a consultas frecuentes por usuario, estado, prioridad y fecha.
