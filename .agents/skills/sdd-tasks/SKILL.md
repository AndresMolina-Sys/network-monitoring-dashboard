---
name: sdd-tasks
description: Desglosa un plan SDD aprobado en tareas pequeñas, ordenadas y verificables.
---

# Fase `tasks`

Lee `AGENTS.md`, `MEMORY.md`, `docs/constitution.md`, `spec.md` y `plan.md`. Confirma que spec y plan están aprobados explícitamente; de lo contrario, devuelve el bloqueo al coordinador sin editar.

Crea o actualiza únicamente `tasks.md`. Usa checkboxes e IDs estables (`T-001`, ...), orden de dependencia, estimaciones acotadas (idealmente 20–30 minutos), RF cubiertos y una línea verificable `Hecho cuando:` por tarea. Mantén tareas atómicas, sin tareas de implementación que mezclen capas innecesariamente, y usa los comandos existentes del repositorio.

Registra `Estado: Pendiente de aprobación`. No modifiques código ni marques tareas aprobadas/completadas. El coordinador espera la aprobación del usuario antes de implementar.
