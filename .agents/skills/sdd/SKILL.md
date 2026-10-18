---
name: sdd
description: Clasifica solicitudes del dashboard y las enruta a $feature o a la fase SDD adecuada.
---

# Enrutador SDD del dashboard

Usa `$sdd` como punto de entrada para una solicitud de cambio:

- Si el usuario indica una fase, consérvala y sigue `$sdd-coordinator` junto con la skill de esa fase (`$sdd-spec`, `$sdd-clarify`, `$sdd-plan`, `$sdd-tasks`, `$sdd-implement`, `$sdd-validate`, `$sdd-change`, `$sdd-status` o `$sdd-constitution`).
- Si no indica fase, clasifica el alcance. Cambios pequeños, localizados y verificables —como ajustar texto, una tabla o accesibilidad dentro de una vista— pasan directamente a `$feature`.
- Cambios que cruzan capas/pantallas, cambian contratos o requieren requisitos propios pasan a `$sdd-coordinator` y al flujo spec-anchored.
- Si una ambigüedad puede cambiar el alcance o el proceso, aclara solo lo necesario antes de enrutar. No elijas `$feature` para eludir una spec.

La selección de una skill nunca equivale a aprobación ni autoriza avanzar de fase. La conversación principal conserva las preguntas, aprobaciones y revisión final. No uses sintaxis de OpenCode.
