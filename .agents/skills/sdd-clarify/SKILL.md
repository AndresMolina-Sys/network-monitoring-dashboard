---
name: sdd-clarify
description: Revisa una spec SDD para detectar ambigüedades y resolver decisiones con el usuario.
---

# Fase `clarify`

Lee la spec indicada y `docs/constitution.md`. Identifica ambigüedades, contradicciones, casos límite ausentes, criterios no verificables y conflictos de alcance. Basa cada observación en evidencia de la spec o constitución.

Si el usuario pide solo una auditoría, entrega únicamente hallazgos, sin soluciones. Para resolver dudas, el coordinador pregunta al usuario de una en una, priorizando decisiones de comportamiento, errores, límites y exclusiones; no preguntes por detalles de implementación que pertenecen a `plan`. No inventes respuestas ni hagas que el subagente pregunte directamente.

Cuando el coordinador aporte respuestas explícitas, actualiza únicamente `spec.md`, conserva las decisiones y el estado pendiente de aprobación. Tras cualquier modificación, el coordinador ejecuta la revisión QA de spec antes de presentarla. No crees ni edites plan/tareas, código, ni estados de aprobación.
