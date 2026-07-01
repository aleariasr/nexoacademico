# Estrategia de pruebas

## Verificación mínima

```bash
cd backend
python manage.py check
python manage.py test
```

```bash
cd frontend
npm ci
npm run lint
npm run build
```

## Casos funcionales prioritarios

1. Registro y login correctos e incorrectos.
2. Acceso denegado sin token.
3. Un estudiante no puede crear cursos ni actividades.
4. Un profesor solo consulta y modifica sus cursos.
5. Un administrador puede crear cuentas y cursos.
6. No se permiten matrículas duplicadas.
7. No se permiten entregas duplicadas.
8. Una eliminación de actividad conserva el registro y crea historial.
9. Los filtros por estado, prioridad, curso y vencimiento devuelven resultados correctos.
10. Un profesor puede revisar una entrega y guardar nota y retroalimentación.

## Pendiente técnico

El repositorio no contiene una suite automatizada suficiente. Añade pruebas de API con `APITestCase` o `pytest-django`, y pruebas de interfaz con Playwright antes de declarar cobertura de producción.
