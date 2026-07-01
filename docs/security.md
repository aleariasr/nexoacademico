# Seguridad y configuración

## Controles existentes

- Autenticación obligatoria por defecto en Django REST Framework.
- Validadores de contraseña de Django.
- Separación de permisos por rol.
- Filtrado de recursos según cursos asignados o matrículas.
- Variables de entorno para credenciales y configuración sensible.
- Eliminación lógica de actividades y registro histórico.

## Recomendaciones antes de producción

- Validar que `SECRET_KEY` exista al iniciar la aplicación.
- Separar settings de desarrollo y producción.
- Restringir dinámicamente CORS, CSRF y `ALLOWED_HOSTS` por ambiente.
- Servir la aplicación exclusivamente mediante HTTPS.
- Usar tokens con expiración o JWT con rotación.
- Limitar tamaño y tipos MIME de archivos cargados.
- Almacenar archivos en un servicio externo, no en el filesystem del servidor web.
- Añadir rate limiting y registro de eventos de seguridad.
- Ejecutar `python manage.py check --deploy` para el ambiente productivo.
