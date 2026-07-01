# Instalación y configuración

Consulta la sección de instalación del `README.md` raíz. Antes de ejecutar el proyecto:

1. Crea una base MySQL con `utf8mb4`.
2. Copia los archivos `.env.example` sin eliminar los originales.
3. Ejecuta migraciones y `seed_task_types`.
4. Verifica el backend con `python manage.py check`.
5. Regenera el lockfile del frontend con `npm install`.
6. Verifica una instalación limpia con `npm ci`, `npm run lint` y `npm run build`.

No uses el puerto `8889` como valor universal en la documentación. Ese valor corresponde normalmente a configuraciones locales como MAMP. Para MySQL estándar usa `3306` y documenta cualquier excepción.
