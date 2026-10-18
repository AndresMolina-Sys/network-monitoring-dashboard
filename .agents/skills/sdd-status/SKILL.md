---
name: sdd-status
description: Resume en modo de solo lectura el estado y siguiente paso de una iniciativa SDD.
---

# Fase `status`

Lee `spec.md`, `plan.md` y `tasks.md` que existan para la iniciativa. Resume fase actual, estados de aprobación tal como están escritos, RF o dudas abiertas, tareas completas/restantes y el siguiente paso requerido.

No infieras aprobación a partir de Git, mensajes de “continúa” o resultados de CI. Si el estado no consta en un artefacto, indícalo como desconocido. No edites archivos, no actualices memoria y no avances de fase.
