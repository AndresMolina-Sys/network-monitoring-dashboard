# MEMORY.md — Dashboard

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- Frontend React/TypeScript desplegado en Vercel; API ASP.NET Core .NET 10 desplegada en Render.
- Dashboard responsive con inventario de nodos, detalle de métricas y selector de periodos `1h`, `24h` y `7d`; el detalle resume latencia reciente, latencia promedio y pérdida máxima del periodo.
- La API usa tres nodos de prueba en memoria y soporta métricas `1h`, `24h` y `7d`; no hay persistencia ni telemetría en tiempo real.
- El frontend usa la API si existe `VITE_API_BASE_URL`; sin ella, usa fixtures mock. `?demo=empty|error|slow` solo funciona en desarrollo.
- La spec, el plan y las tareas de `specs/001-rangos-de-metricas-simuladas/` están aprobados; T-001 a T-010 están completas.
- `specs/002-grafica-perdida-de-paquetes/spec.md`, `plan.md` y `tasks.md` están aprobados; T-001 a T-005 están completas. La revisión manual de producción se confirmó con capturas del usuario; CI y Vercel están en verde.
- T-010 se verificó en producción tras el commit `0bd3b22`: la UI ofrece `1h`, `24h` y `7d`, muestra “Simulated data” y la API responde 200 con 4, 25 y 29 puntos.
- CI para `0bd3b22` terminó correctamente; el despliegue de Vercel quedó `READY`.
- El mock y la API ofrecen fixtures deterministas `1h`, `24h` y `7d` para los tres nodos; cada apertura inicia en `1h` y el selector conserva el rango actual.
- `$sdd` clasifica y enruta a `$feature` o `$sdd-coordinator`; las fases SDD tienen skills separadas y perfiles de proyecto versionados en `.codex/agents/`.
- El coordinador principal conserva preguntas y aprobaciones; un revisor hace QA de solo lectura de cada spec antes de presentarla. La aprobación sigue siendo del usuario.
- `$feature` implementa cambios pequeños directamente, sin lista de pasos, `feature.md` ni aprobación adicional; F-001, F-002 y F-003 están completos.

## Decisiones (y por qué)

- Mantener `NetworkMonitoringService` como límite entre UI y datos para poder alternar mock/API y probar componentes con servicios inyectados.
- Mantener “Simulated data” junto al selector, visible sin hover en carga, éxito, vacío y error; no prometer uptime, alertas, autenticación o telemetría en tiempo real.
- Mantener `graphify-out` generado y enlazado desde README; `AGENTS.md` exige actualizarlo al completar una spec y ante cambios significativos fuera de ella, no tras cada tarea individual.
- Crear siempre un commit local al terminar cambios solicitados, con asunto convencional en inglés; hacer push solo cuando el usuario lo pida explícitamente. No añadir líneas `Co-authored-by` ni otra atribución de autor/agente.
- No exponer claves, tokens ni secretos en archivos, logs, comandos, capturas o respuestas.
- Mantener todo el código y contenido de la aplicación en inglés (identificadores, comentarios, pruebas, mensajes de API y textos visibles); la documentación puede seguir el idioma solicitado.
- Usar SDD spec-anchored: `specs/NNN-nombre/{spec.md,plan.md,tasks.md}`; fases con aprobación explícita, una tarea por implementación.
- Para la spec 001: cada apertura inicia en `1h`; ventanas móviles UTC ancladas a la última muestra, extremos incluidos; cadencias de 20 min (`1h`), 1 h (`24h`) y 6 h (`7d`).
- Todos los nodos deben tener muestras simuladas para los tres rangos; la etiqueta “Simulated data” permanece junto al rango en carga, éxito, vacío y error.
- La última selección de rango prevalece; datos incompletos, corruptos, desordenados, duplicados, fuera de ventana o fuera de límites numéricos producen error sin cambiar el rango. Vacío es excepcional.
- La spec 001 cubre modo mock local y dashboard de producción; conserva el comportamiento existente de nodo inexistente y reintentos.
- Mantener al agente principal como único coordinador de aprobación; pasar a subagentes el alcance y contexto exactos, serializar escrituras y paralelizar solo revisiones independientes de solo lectura. Los perfiles heredan permisos del coordinador; sus instrucciones no son sandbox.
- Para cambios pequeños solicitados, `$feature` implementa directamente sin lista de pasos ni documento adicional; detenerse ante decisiones materiales nuevas o límites de alcance.
- Al coordinar una solicitud nueva con `$sdd` sin fase explícita, clasificar primero: cambios localizados a `$feature`; cambios amplios o entre capas al flujo SDD. Las invocaciones con fase explícita conservan esa fase.
- Versionar solo las skills propias `feature`, `sdd`, `sdd-*`; las skills de terceros, como `frontend-design` y `ui-ux-pro-max`, permanecen locales e ignoradas.

## Aprendizajes y errores a evitar

- Las 12 skills propias pasan `quick_validate.py` con un Python que tenga PyYAML y modo UTF-8 habilitado (`-X utf8` puede ser necesario en Windows).
- Las pruebas TypeScript del repo usan Vitest; `node --test` no carga el setup ni la resolución de módulos del proyecto. Ejecutar Vitest con `npm run test -- <ruta>`.
- En Recharts 3, las etiquetas del eje se renderizan en un grupo hermano; las stories deben consultar `.recharts-yAxis-tick-labels`. Para probar tooltips, enviar `mousemove` a las coordenadas del punto y esperar el valor renderizado.
- En este entorno Windows, Vitest puede detenerse antes de ejecutar pruebas por `EPERM` al renombrar su caché temporal; con autorización, repetir la prueba dirigida fuera del sandbox.
- Playwright puede quedar detenido antes de descubrir tests dentro del sandbox; la ejecución autorizada fuera del sandbox pasó desktop y móvil.
- `npm run build-storybook` termina correctamente con una advertencia de chunks generados mayores de 500 kB; registrar la advertencia, no tratarla como fallo.

## Próximos pasos

- No hay propuestas pequeñas pendientes; mantener el flujo SDD para cambios grandes o que crucen contratos/capas.
