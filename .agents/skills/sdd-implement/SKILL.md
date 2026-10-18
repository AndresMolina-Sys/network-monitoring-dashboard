---
name: sdd-implement
description: Implementa una sola tarea SDD aprobada del dashboard y verifica su condición de terminado.
---

# Fase `implement`

Implementa solo la tarea `T-xxx` solicitada. Antes de editar, confirma en `spec.md`, `plan.md` y `tasks.md` que los tres están aprobados por el usuario y verifica RF cubiertos, dependencias, archivos permitidos y `Hecho cuando:`. Si falta una condición, detente y devuelve el bloqueo al coordinador.

Para comportamiento, escribe primero pruebas y luego el código. Para cambios documentales/configuración aplica verificaciones proporcionales. Respeta los límites de servicio/API, los datos simulados, CORS explícito y el idioma inglés para código y UI. No agregues dependencias ni amplíes alcance sin autorización.

Actualiza únicamente el estado de la tarea asignada y reporta evidencia real. Si las verificaciones fallan o aparece un error, detente en esta tarea e informa al coordinador; no empieces otra tarea ni hagas commit, push o deploy. El coordinador inspecciona el diff, actualiza memoria y crea el commit local cuando el trabajo autorizado esté completo.
