---
name: sdd-validate
description: Valida requisitos SDD del dashboard contra pruebas y evidencia verificable, sin arreglarlos.
---

# Fase `validate`

Haz una revisión de solo lectura de los RF de la spec indicada frente a los artefactos aprobados, cambios reales y resultados disponibles. Comprueba trazabilidad RF → plan/tarea → prueba/evidencia, cumplimiento de alcance y constitución. Distingue evidencia observada, inferencias y aspectos no comprobados; informa cobertura y fallos concretos con rutas/líneas cuando sea posible.

Selecciona solo las verificaciones pertinentes: `npm run test` para Vitest, `dotnet test backend/NetworkMonitoring.Api.Tests/NetworkMonitoring.Api.Tests.csproj` para xUnit, `npm run test:e2e` para Playwright y `npm run test:e2e:full-stack` cuando el flujo requiera API real. No afirmes que una prueba pasó si no la ejecutaste u observaste.

No edites archivos, no cambies estados de aprobación/completitud y no arregles fallos. Devuelve hallazgos y evidencia al coordinador. Las instrucciones de lectura son una convención, no una barrera de permisos.
