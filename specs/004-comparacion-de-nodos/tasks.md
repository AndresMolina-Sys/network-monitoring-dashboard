# Tasks 004 — Comparación de nodos

Estado: Aprobado por el usuario

- [x] **T-001 — Escribir pruebas para la validación compartida de métricas**

  **Estimación:** 25 min · **Dependencias:** Ninguna · **RF:** RF-3, RF-5

  **Hecho cuando:** `metrics-validation.test.ts` cubre los tres rangos, anclaje UTC, extremos inclusivos, conteo, cadencia, orden, duplicados, ventana y límites de latencia/pérdida; las pruebas fallan por ausencia del módulo, no por configuración.

- [x] **T-002 — Extraer la validación de métricas existente**

  **Estimación:** 25 min · **Dependencias:** T-001 · **RF:** RF-3, RF-5

  **Hecho cuando:** `metrics-validation.ts` expone la validación pura reutilizable por el detalle y la comparación, y `use-node-metrics.test.ts` conserva verdes sus casos actuales de respuesta, ventana y valores inválidos.

- [x] **T-003 — Escribir pruebas del estado de comparación por nodo**

  **Estimación:** 25 min · **Dependencias:** T-002 · **RF:** RF-3, RF-4, RF-5, RF-6, RF-9

  **Hecho cuando:** `use-node-comparison.test.ts` especifica llamadas por ID/rango, éxito independiente, error, no encontrado, vacío, datos inválidos, selección/rango cambiantes y respuestas diferidas fuera de orden.

- [x] **T-004 — Implementar la carga independiente de métricas comparadas**

  **Estimación:** 25 min · **Dependencias:** T-003 · **RF:** RF-3, RF-4, RF-5, RF-6, RF-9

  **Hecho cuando:** `use-node-comparison.ts` usa el servicio existente y validador compartido, cancela o ignora respuestas obsoletas y mantiene el resultado o estado correcto de cada nodo por separado.

- [x] **T-005 — Escribir pruebas de selección de nodos en el inventario**

  **Estimación:** 25 min · **Dependencias:** Ninguna · **RF:** RF-1

  **Hecho cuando:** `network-nodes-panel.test.tsx` verifica selección de dos y tres nodos, límite de tres, acción bloqueada con menos de dos y disponibilidad de la selección para completar el mínimo.

- [x] **T-006 — Añadir selección de nodos al inventario**

  **Estimación:** 25 min · **Dependencias:** T-005 · **RF:** RF-1

  **Hecho cuando:** `network-nodes-panel.tsx` y `network-node-card.tsx` permiten seleccionar hasta tres nodos con controles independientes del enlace de detalle, muestran el conteo y habilitan iniciar solo con dos o tres.

- [x] **T-007 — Escribir pruebas de las gráficas comparativas**

  **Estimación:** 25 min · **Dependencias:** T-002 · **RF:** RF-2, RF-8

  **Hecho cuando:** las pruebas/story checks del gráfico especifican series distinguibles por identidad además del color, alineación por tiempo transcurrido con anclas UTC distintas y tooltip con timestamp original.

- [x] **T-008 — Implementar gráficas de comparación accesibles**

  **Estimación:** 25 min · **Dependencias:** T-007 · **RF:** RF-2, RF-8

  **Hecho cuando:** `node-metrics-comparison-chart.tsx` presenta series por nodo agrupadas por métrica, usa tiempo transcurrido como eje y conserva identidad y timestamp UTC en tooltip y contenido accesible; su story muestra ambas métricas.

- [x] **T-009 — Escribir pruebas de la página comparativa**

  **Estimación:** 25 min · **Dependencias:** T-004, T-008 · **RF:** RF-3, RF-4, RF-5, RF-6, RF-7, RF-8

  **Hecho cuando:** `network-node-comparison-page.test.tsx` verifica rango inicial y cambios, etiqueta “Simulated data” en carga/éxito/vacío/error, estados parciales por nodo y tabla accesible con valores y timestamps UTC.

- [x] **T-010 — Implementar la página de comparación**

  **Estimación:** 25 min · **Dependencias:** T-009 · **RF:** RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8

  **Hecho cuando:** `network-node-comparison-page.tsx` conecta selección, rango y hook; muestra gráficas y tabla para datos válidos, estados por nodo para los demás casos y “Simulated data” en todos los estados, con una story representativa.

- [x] **T-011 — Conectar la ruta de comparación**

  **Estimación:** 20 min · **Dependencias:** T-006, T-010 · **RF:** RF-1, RF-9

  **Hecho cuando:** `src/app/router.tsx` registra `/compare` con carga diferida y fallback accesible, interpreta los IDs seleccionados desde la URL y dirige al estado de selección insuficiente/inválida sin resultados obsoletos.

- [x] **T-012 — Escribir pruebas E2E del flujo y la ruta comparativa**

  **Estimación:** 25 min · **Dependencias:** T-006, T-010, T-011 · **RF:** RF-1, RF-2, RF-3, RF-4, RF-7, RF-8, RF-9

  **Hecho cuando:** Playwright en `e2e/network-monitoring.spec.ts` cubre selección desde inventario, dos/tres nodos, rangos, estados, tabla, navegación por teclado y viewport móvil; comprueba que no hay desbordamiento horizontal ni datos de una selección anterior.

- [x] **T-013 — Ajustar presentación y responsive de comparación**

  **Estimación:** 25 min · **Dependencias:** T-008, T-010, T-011, T-012 · **RF:** RF-1, RF-2, RF-7, RF-8; requisitos no funcionales

  **Hecho cuando:** `src/App.css` mantiene selección, gráficas, leyendas, controles, estados y tabla comprensibles a 390 × 844 y escritorio, sin desbordamiento horizontal y respetando foco visible y movimiento reducido.

- [ ] **T-014 — Ejecutar verificaciones frontend y Storybook**

  **Estimación:** 30 min · **Dependencias:** T-001 a T-013 · **RF:** RF-1 a RF-9

  **Hecho cuando:** `npm run format:check`, `npm run lint`, `npm run test`, `npm run build` y `npm run build-storybook` terminan correctamente; cualquier fallo se registra y se corrige antes de continuar.

- [ ] **T-015 — Ejecutar E2E con mocks en escritorio y móvil**

  **Estimación:** 25 min · **Dependencias:** T-014 · **RF:** RF-1 a RF-9; requisitos no funcionales

  **Hecho cuando:** `npm run test:e2e` pasa la navegación de comparación, los tres rangos, estados y alternativa accesible, e informa cero desbordamiento horizontal a 390 × 844.

- [ ] **T-016 — Ejecutar la regresión full-stack existente**

  **Estimación:** 25 min · **Dependencias:** T-015 · **RF:** RF-3, RF-4, RF-9

  **Hecho cuando:** `npm run test:e2e:full-stack` pasa contra la API local y confirma que las rutas y contratos existentes siguen compatibles; esta regresión no se presenta como prueba específica de comparación y no altera backend ni despliegue.

- [ ] **T-017 — Actualizar e inspeccionar Graphify al cerrar la spec**

  **Estimación:** 30 min · **Dependencias:** T-001 a T-016 completadas · **RF:** RF-1 a RF-9

  **Hecho cuando:** Graphify se refresca una sola vez tras completar las demás tareas; se inspeccionan `graphify-out/graph.json` y `graphify-out/GRAPH_REPORT.md` para confirmar la nueva ruta, carga y vistas comparativas; solo `graph.json`, `graph.html` y `GRAPH_REPORT.md` quedan previstos para el commit final, sin cachés, backups ni notas locales.
