# MEMORY.md — Dashboard

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- Frontend React/TypeScript desplegado en Vercel; API ASP.NET Core .NET 10 desplegada en Render.
- Dashboard responsive con inventario de nodos, detalle de métricas y selector de periodos `1h`, `24h` y `7d`.
- La API usa tres nodos de prueba en memoria y soporta métricas `1h`, `24h` y `7d`; no hay persistencia ni telemetría en tiempo real.
- El frontend usa la API si existe `VITE_API_BASE_URL`; sin ella, usa fixtures mock. `?demo=empty|error|slow` solo funciona en desarrollo.
- La spec, el plan y las tareas de `specs/001-rangos-de-metricas-simuladas/` están aprobados; T-001 a T-010 están completas.
- `specs/002-grafica-perdida-de-paquetes/spec.md`, `plan.md` y `tasks.md` están aprobados; T-001 y T-002 están completas, T-003 es la siguiente.
- T-010 se verificó en producción tras el commit `0bd3b22`: la UI ofrece `1h`, `24h` y `7d`, muestra “Simulated data” y la API responde 200 con 4, 25 y 29 puntos.
- CI para `0bd3b22` terminó correctamente; el despliegue de Vercel quedó `READY`.
- El mock y la API ofrecen fixtures deterministas `1h`, `24h` y `7d` para los tres nodos; cada apertura inicia en `1h` y el selector conserva el rango actual.
- El coordinador de Codex delega SDD a perfiles de proyecto: planificador, implementador de una tarea y revisor; los perfiles se versionan en `.codex/agents/`.

## Decisiones (y por qué)

- Mantener `NetworkMonitoringService` como límite entre UI y datos para poder alternar mock/API y probar componentes con servicios inyectados.
- Mantener “Simulated data” junto al selector, visible sin hover en carga, éxito, vacío y error; no prometer uptime, alertas, autenticación o telemetría en tiempo real.
- Mantener `graphify-out` generado y enlazado desde README; actualizarlo por cambios significativos de código/arquitectura, no por cambios solo de documentación.
- Crear siempre un commit local al terminar cambios solicitados, con asunto convencional en inglés; hacer push solo cuando el usuario lo pida explícitamente. No añadir líneas `Co-authored-by` ni otra atribución de autor/agente.
- No exponer claves, tokens ni secretos en archivos, logs, comandos, capturas o respuestas.
- Mantener todo el código y contenido de la aplicación en inglés (identificadores, comentarios, pruebas, mensajes de API y textos visibles); la documentación puede seguir el idioma solicitado.
- Usar SDD spec-anchored: `specs/NNN-nombre/{spec.md,plan.md,tasks.md}`; fases con aprobación explícita, una tarea por implementación.
- Para la spec 001: cada apertura inicia en `1h`; ventanas móviles UTC ancladas a la última muestra, extremos incluidos; cadencias de 20 min (`1h`), 1 h (`24h`) y 6 h (`7d`).
- Todos los nodos deben tener muestras simuladas para los tres rangos; la etiqueta “Simulated data” permanece junto al rango en carga, éxito, vacío y error.
- La última selección de rango prevalece; datos incompletos, corruptos, desordenados, duplicados, fuera de ventana o fuera de límites numéricos producen error sin cambiar el rango. Vacío es excepcional.
- La spec 001 cubre modo mock local y dashboard de producción; conserva el comportamiento existente de nodo inexistente y reintentos.
- La Skill `$sdd` está en `.agents/skills/sdd/` y permanece local porque `.agents/` se ignora intencionalmente en Git.
- Mantener al agente principal como único coordinador de aprobación; pasar a subagentes el alcance y contexto exactos, serializar escrituras y paralelizar solo revisiones independientes de solo lectura. Los perfiles heredan permisos del coordinador; sus instrucciones no son sandbox.

## Aprendizajes y errores a evitar

- `quick_validate.py` requiere PyYAML, ausente en los Python disponibles; no agregues una dependencia solo para esta validación sin aprobación.
- Las pruebas TypeScript del repo usan Vitest; `node --test` no carga el setup ni la resolución de módulos del proyecto. Ejecutar Vitest con `npm run test -- <ruta>`.
- En Recharts 3, las etiquetas del eje se renderizan en un grupo hermano; las stories deben consultar `.recharts-yAxis-tick-labels`. Para probar tooltips, enviar `mousemove` a las coordenadas del punto y esperar el valor renderizado.
- En este entorno Windows, Vitest puede detenerse antes de ejecutar pruebas por `EPERM` al renombrar su caché temporal; con autorización, repetir la prueba dirigida fuera del sandbox.

## Próximos pasos

- Continuar con T-003 de Spec 002: verificar en Playwright la sincronización y el layout responsive.
