# Tasks 005 — Resumen por nodo en la comparación

Estado: Pendiente de aprobación

- [ ] **T-001 — Extraer y probar el resumen compartido del detalle**

  **Estimación:** 30 min · **Dependencias:** Ninguna · **RF:** RF-3, RF-4

  **Hecho cuando:** El detalle usa el helper compartido y sus pruebas confirman latencia más reciente por timestamp, promedio, pérdida máxima, unidades y formato, además de conservar el punto de pérdida máxima usado por su anotación.

- [ ] **T-002 — Mostrar los resúmenes de los nodos comparados**

  **Estimación:** 30 min · **Dependencias:** T-001 · **RF:** RF-1, RF-2, RF-3, RF-4, RF-9

  **Hecho cuando:** Las pruebas de comparación verifican una tarjeta por cada nodo exitoso con métricas, los tres KPI calculados con el periodo vigente, su actualización en `1h`, `24h` y `7d`, y la permanencia de “Simulated data”.

- [ ] **T-003 — Resolver nombres e identificadores de nodo**

  **Estimación:** 25 min · **Dependencias:** T-002 · **RF:** RF-5

  **Hecho cuando:** Las pruebas confirman que las tarjetas muestran nombre e ID cuando el catálogo responde y usan el ID si `listNodes()` sigue pendiente, falla o no contiene el nodo, sin bloquear ni alterar la carga de métricas.

- [ ] **T-004 — Verificar estados parciales y descarte de resúmenes obsoletos**

  **Estimación:** 25 min · **Dependencias:** T-002, T-003 · **RF:** RF-1, RF-2, RF-7, RF-8

  **Hecho cuando:** Las pruebas de página y de `use-node-comparison` confirman que carga, vacío, error, nodo inexistente y métricas inválidas no muestran tarjetas antiguas, que los nodos válidos conservan su tarjeta ante fallos parciales y que respuestas tardías de otra selección o periodo no reemplazan la vigente.

- [ ] **T-005 — Ajustar el orden y el layout responsive de las tarjetas**

  **Estimación:** 25 min · **Dependencias:** T-002 · **RF:** RF-6, RF-9

  **Hecho cuando:** Las pruebas verifican que las tarjetas aparecen después de los controles del periodo y antes de las gráficas, mantienen etiquetas identificables y su contenido puede ajustarse en móvil sin desbordamiento horizontal.

- [ ] **T-006 — Comprobar comparación y viewport móvil con Playwright**

  **Estimación:** 30 min · **Dependencias:** T-003, T-004, T-005 · **RF:** RF-1, RF-5, RF-6, RF-7, RF-8, RF-9

  **Hecho cuando:** `npm run test:e2e` confirma en escritorio y a 390 × 844 que los periodos actualizan conjuntamente los resúmenes y datos de comparación, los nombres tienen respaldo por ID, los estados no exitosos no muestran KPI obsoletos y no hay overflow horizontal.

- [ ] **T-007 — Ejecutar la verificación local completa**

  **Estimación:** 30 min · **Dependencias:** T-001 a T-006 · **RF:** RF-1 a RF-9

  **Hecho cuando:** Pasan `npm run format:check`, `npm run lint`, `npm run test`, `npm run build` y `npm run test:e2e`; los resultados de verificación cubren cada RF y no se modifican API, contratos ni fixtures.

- [ ] **T-008 — Actualizar e inspeccionar Graphify**

  **Estimación:** 20 min · **Dependencias:** T-007 · **RF:** Ninguno (mantenimiento del repositorio)

  **Hecho cuando:** Tras completar las tareas de la spec se actualiza Graphify una sola vez con su flujo soportado, se inspeccionan el grafo y el reporte generados y se identifican los outputs versionados que deben incluirse en el commit final.
