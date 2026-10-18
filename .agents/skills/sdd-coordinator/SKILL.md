---
name: sdd-coordinator
description: Coordina el flujo SDD del dashboard, sus agentes, revisiones QA y aprobaciones humanas.
---

# Coordinación SDD

La conversación principal actúa como coordinador y es responsable de todas las preguntas, decisiones, aprobaciones y entrega. Lee `AGENTS.md`, `MEMORY.md`, `docs/constitution.md` y los artefactos de la spec activa; verifica los hechos técnicos en el repositorio. Para arquitectura, consulta Graphify cuando esté disponible y confirma sus resultados en el código.

## Delegación

- Usa `sdd_planner` para `spec`, `clarify`, `plan`, `tasks` y ediciones de spec de `change`.
- Usa `sdd_implementer` solo para una tarea aprobada asignada de forma explícita.
- Usa `sdd_reviewer` para QA de specs y para `validate`.
- `status` y `constitution` son lecturas del coordinador. Si un perfil no está disponible, sigue la skill de fase directamente.
- En cada delegación proporciona fase, solicitud, decisiones confirmadas, alcance y archivos autorizados, artefactos pertinentes, resultado esperado y reglas de parada. Los subagentes no preguntan ni solicitan aprobaciones directamente al usuario.
- Un solo agente escribe a la vez. Solo paraleliza análisis/revisiones independientes de solo lectura. Inspecciona diffs y resultados antes de informar.

## QA automático de specs

Después de que `spec`, `clarify` o `change` cree o modifique `spec.md`, solicita al revisor una comprobación de solo lectura antes de presentar el artefacto:

1. Verifica ambigüedades, contradicciones, casos límite, criterios verificables y conformidad con `docs/constitution.md`.
2. Si hay hallazgos corregibles con decisiones ya confirmadas, pide al planificador que corrija únicamente `spec.md`; después solicita otra revisión.
3. Si se necesita una decisión del usuario o persiste un problema material, presenta el hallazgo/pregunta y detente. No inventes decisiones ni dejes que el revisor apruebe.
4. Presenta la spec con `Estado: Pendiente de aprobación`. Solo el usuario puede aprobarla.

La revisión QA no crea plan/tareas ni avanza de fase. Que el revisor no encuentre hallazgos tampoco equivale a aprobación.

## Aprobaciones y límites

- Cada spec, plan y tasks nuevo o modificado queda `Pendiente de aprobación`. Registra `Aprobado por el usuario` únicamente tras una confirmación explícita.
- Solicitar la fase siguiente no aprueba el artefacto anterior. Si la aprobación está ausente, detente en la fase actual y pide aprobación.
- `plan` requiere spec aprobada; `tasks` requiere spec y plan aprobados; `implement` requiere spec, plan y tasks aprobados y una petición explícita que identifique una tarea.
- Implementa una tarea por solicitud y detente al acabar. Si aparece un error o bloqueo, informa y no avances a otra tarea.
- Las skills y subagentes no amplían permisos. No añadas dependencias, cambies contratos, despliegues ni hagas push salvo autorización explícita. No reveles secretos ni añadas atribuciones a commits.

## Idioma, archivos y entrega

Las specs, planes y tareas se redactan en español; código, pruebas, comentarios e interfaz permanecen en inglés. Usa `specs/NNN-nombre/` y los artefactos `spec.md`, `plan.md`, `tasks.md`. No crees una spec de ejemplo. Actualiza `MEMORY.md` al terminar y aplica el commit local requerido por `AGENTS.md`; el coordinador inspecciona y crea el commit, no el subagente. Push y deploy solo ante solicitud explícita.
