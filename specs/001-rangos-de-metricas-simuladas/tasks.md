# Tasks 001 — Rangos de métricas simuladas

Estado: Aprobado por el usuario

- [x] **T-001 — Ampliar fixtures y servicio mock**

  **Estimación:** 25 min · **Dependencias:** Ninguna · **RF:** RF-2, RF-3, RF-4, RF-11

  **Hecho cuando:** Las pruebas del servicio mock confirman las nueve combinaciones de nodo y periodo, con 4, 25 y 29 muestras, cadencias correctas y selección por nodo y periodo.

- [x] **T-002 — Añadir soporte de rangos en la API**

  **Estimación:** 25 min · **Dependencias:** Ninguna · **RF:** RF-2, RF-3, RF-4, RF-10, RF-11

  **Hecho cuando:** Las pruebas xUnit verifican los tres rangos para cada nodo, el valor predeterminado `1h`, y las respuestas 400 y 404 correspondientes.

- [x] **T-003 — Validar estructura y conjuntos completos**

  **Estimación:** 25 min · **Dependencias:** T-001, T-002 · **RF:** RF-4, RF-7, RF-8

  **Hecho cuando:** Las pruebas del hook distinguen un conjunto vacío de uno parcial e inválido, y rechazan cantidades incorrectas, identidad de nodo o periodo equivocada y datos requeridos ausentes.

- [x] **T-004 — Validar ventanas, marcas de tiempo y límites**

  **Estimación:** 25 min · **Dependencias:** T-003 · **RF:** RF-3, RF-7

  **Hecho cuando:** Las pruebas confirman el ancla más reciente, UTC, extremos inclusivos, orden estricto, marcas únicas y válidas, latencia no negativa y pérdida entre 0 % y 100 %; los casos inválidos terminan en error.

- [x] **T-005 — Proteger selección y estados ante solicitudes concurrentes**

  **Estimación:** 25 min · **Dependencias:** T-003, T-004 · **RF:** RF-6, RF-9, RF-10

  **Hecho cuando:** Las pruebas diferidas confirman que una respuesta antigua no reemplaza la selección reciente y que fallos, reintentos repetidos y nodo inexistente conservan sus estados diferenciados.

- [x] **T-006 — Incorporar el selector de periodo**

  **Estimación:** 25 min · **Dependencias:** T-005 · **RF:** RF-1, RF-2

  **Hecho cuando:** Las pruebas de página confirman que cada apertura inicia en `1h`, que se puede elegir cada periodo y que título, gráfico y tabla corresponden a la selección actual.

- [x] **T-007 — Mantener visible la etiqueta de datos simulados**

  **Estimación:** 20 min · **Dependencias:** T-006 · **RF:** RF-5

  **Hecho cuando:** Las pruebas verifican el texto exacto “Simulated data” junto al periodo, sin hover, en carga, éxito, vacío y error.

- [x] **T-008 — Verificar gráficos y flujo responsive con mocks**

  **Estimación:** 25 min · **Dependencias:** T-006, T-007 · **RF:** RF-2, RF-4, RF-11

  **Hecho cuando:** Playwright confirma los tres periodos en escritorio y viewport móvil de 390 × 844, sin desbordamiento horizontal y conservando todas las muestras en la tabla; se ajustan las etiquetas del gráfico solo si hace falta para legibilidad.

- [x] **T-009 — Sincronizar documentación y ejecutar verificación local**

  **Estimación:** 30 min · **Dependencias:** T-001 a T-008 · **RF:** RF-1 a RF-11

  **Hecho cuando:** README y AGENTS.md reflejan los tres rangos; `npm run format:check`, `npm run lint`, `npm run test`, `npm run build`, `npm run build-storybook`, xUnit y las suites Playwright mock y full-stack pasan; MEMORY.md registra T-001 a T-009 completas y T-010 pendiente de aceptación en producción.

- [x] **T-010 — Comprobar aceptación en producción**

  **Estimación:** 15 min · **Dependencias:** T-009 y despliegue autorizado disponible · **RF:** RF-11

  **Hecho cuando:** En el dashboard de producción actualizado se comprueban los tres periodos y la etiqueta “Simulated data”. No desplegar, promover ni cambiar configuración como parte de esta tarea; si no hay despliegue autorizado, dejarla pendiente.
