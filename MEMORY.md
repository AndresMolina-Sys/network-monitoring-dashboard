# MEMORY.md — Dashboard

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- Frontend React/TypeScript desplegado en Vercel; API ASP.NET Core .NET 10 desplegada en Render.
- Dashboard responsive con inventario de nodos y detalle de métricas; el último cambio de código registrado corrige overflow móvil.
- La API usa tres nodos de prueba en memoria; actualmente solo soporta métricas `1h`. No hay persistencia ni telemetría en tiempo real.
- El frontend usa la API si existe `VITE_API_BASE_URL`; sin ella, usa fixtures mock. `?demo=empty|error|slow` solo funciona en desarrollo.
- La estructura SDD está en `docs/constitution.md`; aún no hay una funcionalidad especificada ni directorio `specs/`.
- El coordinador de Codex delega SDD a perfiles de proyecto: planificador, implementador de una tarea y revisor; los perfiles se versionan en `.codex/agents/`.

## Decisiones (y por qué)

- Mantener `NetworkMonitoringService` como límite entre UI y datos para poder alternar mock/API y probar componentes con servicios inyectados.
- No mostrar rangos `24h`/`7d` ni prometer uptime, alertas, autenticación o tiempo real hasta implementarlos de extremo a extremo.
- Mantener `graphify-out` generado y enlazado desde README; actualizarlo por cambios significativos de código/arquitectura, no por cambios solo de documentación.
- Usar asuntos de commit tipo `feat(ui): ...`; no añadir líneas `Co-authored-by` ni otra atribución de autor/agente.
- No exponer claves, tokens ni secretos en archivos, logs, comandos, capturas o respuestas.
- Mantener todo el código y contenido de la aplicación en inglés (identificadores, comentarios, pruebas, mensajes de API y textos visibles); la documentación puede seguir el idioma solicitado.
- Usar SDD spec-anchored: `specs/NNN-nombre/{spec.md,plan.md,tasks.md}`; fases con aprobación explícita, una tarea por implementación.
- La Skill `$sdd` está en `.agents/skills/sdd/` y permanece local porque `.agents/` se ignora intencionalmente en Git.
- Mantener al agente principal como único coordinador de aprobación; pasar a subagentes el alcance y contexto exactos, serializar escrituras y paralelizar solo revisiones independientes de solo lectura. Los perfiles heredan permisos del coordinador; sus instrucciones no son sandbox.

## Aprendizajes y errores a evitar

- `quick_validate.py` requiere PyYAML, ausente en los Python disponibles; no agregues una dependencia solo para esta validación sin aprobación.

## Próximos pasos

- Vacío por ahora.
