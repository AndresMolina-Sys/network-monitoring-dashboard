# Tasks 006 — Resumen de salud de la flota

Estado: Aprobado por el usuario

- [x] **T-001 — Cargar métricas 1h para la flota**

  **Estimación:** 25 min · **Dependencias:** Ninguna · **RF:** RF-4, RF-6

  Añadir primero pruebas del hook para solicitudes por nodo en `1h`, carga inicial y respuestas diferidas; después implementar el estado de carga y la consulta de todos los nodos.

  **Hecho cuando:** Las pruebas del hook confirman una solicitud `1h` por nodo y que el estado inicial permanece cargando hasta resolverse todas las solicitudes.

- [x] **T-002 — Aislar respuestas de métricas inválidas**

  **Estimación:** 25 min · **Dependencias:** T-001 · **RF:** RF-7, RF-8

  Añadir primero casos de prueba para respuestas vacías, incompletas, con muestras inválidas, `nodeId` incorrecto o rango distinto de `1h`; después aplicar la validación completa por nodo.

  **Hecho cuando:** Cada respuesta inválida excluye el conjunto completo de ese nodo, lo marca como fallido y las pruebas verifican que los nodos restantes siguen siendo utilizables.

- [x] **T-003 — Calcular KPI combinados y cobertura**

  **Estimación:** 25 min · **Dependencias:** T-002 · **RF:** RF-4, RF-5, RF-8

  Añadir primero pruebas con cantidades desiguales de muestras por nodo; después agregar las muestras válidas en conjunto y calcular media de latencia, pérdida máxima y cobertura `X/N`.

  **Hecho cuando:** Las pruebas distinguen la media de todas las muestras de una media de promedios por nodo y confirman la pérdida máxima y la cobertura para resultados completos, parciales y `0/N`.

- [ ] **T-004 — Cancelar solicitudes y descartar resultados obsoletos**

  **Estimación:** 20 min · **Dependencias:** T-001, T-002 · **RF:** RF-6, RF-9

  Añadir primero pruebas diferidas para desmontaje y cambio de población o servicio; después cancelar las solicitudes que ya no sean vigentes y proteger el estado de respuestas tardías.

  **Hecho cuando:** Las pruebas demuestran que solicitudes canceladas o antiguas no actualizan los KPI ni la cobertura de la población vigente.

- [ ] **T-005 — Reintentar solo nodos fallidos**

  **Estimación:** 25 min · **Dependencias:** T-003, T-004 · **RF:** RF-8, RF-9

  Añadir primero pruebas de reintento con respuestas diferidas; después permitir reintentar únicamente los nodos fallidos, conservando los resultados válidos mientras se resuelven.

  **Hecho cuando:** Las pruebas verifican que el reintento omite nodos válidos, conserva temporalmente su agregado y actualiza valores y cobertura al terminar.

- [ ] **T-006 — Mostrar conteos de toda la flota**

  **Estimación:** 20 min · **Dependencias:** Ninguna · **RF:** RF-1, RF-2

  Añadir primero pruebas del panel para conteos por estado; después calcularlos desde la lista completa y presentarlos en la ubicación aprobada, sin depender de los resultados filtrados.

  **Hecho cuando:** Las pruebas confirman los tres conteos correctos y que no cambian al modificar búsqueda o filtro.

- [ ] **T-007 — Sincronizar contadores y filtro accesibles**

  **Estimación:** 25 min · **Dependencias:** T-006 · **RF:** RF-3

  Añadir primero pruebas de interacción por puntero y teclado; después conectar cada contador al filtro existente y reflejar el estado seleccionado en el selector.

  **Hecho cuando:** Las pruebas confirman que cada contador enfoca y activa el filtro correspondiente, que el selector queda sincronizado y que “All statuses” lo restablece.

- [ ] **T-008 — Integrar métricas agregadas en el inventario**

  **Estimación:** 25 min · **Dependencias:** T-005, T-007 · **RF:** RF-4, RF-5, RF-6, RF-7, RF-8, RF-9

  Añadir primero pruebas del panel para carga, éxito completo y parcial, fallo total y reintento; después integrar los KPI, las unidades, cobertura, identificación “Simulated data” y acción de reintento.

  **Hecho cuando:** Las pruebas del panel verifican valores, unidades, cobertura, etiqueta visible sin hover y reintento desde los estados parciales y `0/N`.

- [ ] **T-009 — Conservar estados de carga, error y vacío del inventario**

  **Estimación:** 20 min · **Dependencias:** T-008 · **RF:** RF-10

  Añadir primero pruebas para cada estado de la lista y cambios desde una lista previamente cargada; después asegurar que los estados existentes se conservan y que no aparecen conteos ni KPI obsoletos.

  **Hecho cuando:** Las pruebas del panel confirman que carga, error y lista vacía muestran sus estados actuales sin resumen ni datos de una población anterior.

- [ ] **T-010 — Dar estilo responsive al resumen**

  **Estimación:** 25 min · **Dependencias:** T-008, T-009 · **RF:** RF-1, RF-5; requisitos no funcionales de legibilidad responsive

  Ajustar los estilos existentes para jerarquía, estados de carga y error, y disposición de los conteos y KPI en escritorio y móvil, sin crear archivos de estilo.

  **Hecho cuando:** La interfaz del resumen se lee sin solapamientos en escritorio y a 390 × 844 píxeles, y el navegador no presenta desbordamiento horizontal.

- [ ] **T-011 — Verificar E2E de inventario en escritorio**

  **Estimación:** 25 min · **Dependencias:** T-007, T-008, T-009 · **RF:** RF-1, RF-2, RF-3, RF-5, RF-6

  Ampliar primero los casos E2E existentes y ejecutarlos contra el servicio mock para comprobar conteos, búsqueda, filtros, teclado y resumen cargado.

  **Hecho cuando:** Playwright confirma los conteos independientes de búsqueda, la sincronización de filtros, la activación por teclado y la presentación de métricas simuladas en escritorio.

- [ ] **T-012 — Verificar E2E responsive en móvil**

  **Estimación:** 20 min · **Dependencias:** T-010, T-011 · **RF:** RF-1, RF-5; requisitos no funcionales de legibilidad responsive

  Ampliar primero el flujo móvil E2E existente para inspeccionar los controles y el resumen a 390 × 844 píxeles.

  **Hecho cuando:** Playwright confirma que conteos y KPI son legibles, utilizables y no producen desbordamiento horizontal a 390 × 844 píxeles.

- [ ] **T-013 — Comprobar formato y lint**

  **Estimación:** 15 min · **Dependencias:** T-001 a T-012 · **RF:** RF-1 a RF-10

  Ejecutar `npm run format:check` y `npm run lint` sobre el estado integrado y corregir únicamente problemas dentro del alcance aprobado.

  **Hecho cuando:** Ambos comandos terminan con código de salida cero y no quedan cambios de formato o lint pendientes en los archivos de la funcionalidad.

- [ ] **T-014 — Ejecutar pruebas frontend y build**

  **Estimación:** 25 min · **Dependencias:** T-013 · **RF:** RF-1 a RF-10

  Ejecutar `npm run test` y `npm run build` sobre la implementación integrada.

  **Hecho cuando:** Vitest y el build de producción terminan correctamente, sin fallos de pruebas ni errores de compilación.

- [ ] **T-015 — Ejecutar la suite E2E completa**

  **Estimación:** 25 min · **Dependencias:** T-011, T-012, T-014 · **RF:** RF-1 a RF-10

  Ejecutar `npm run test:e2e` con los proyectos de escritorio y móvil configurados, usando el servicio mock.

  **Hecho cuando:** La suite Playwright completa pasa en ambos tamaños y confirma el flujo de filtros, métricas, teclado y ausencia de desbordamiento móvil.

- [ ] **T-016 — Actualizar e inspeccionar Graphify y cerrar memoria**

  **Estimación:** 25 min · **Dependencias:** T-001 a T-015; solo tras aprobar Tasks y completar todas las tareas anteriores · **RF:** RF-1 a RF-10

  Una vez terminada toda la implementación, actualizar Graphify una sola vez mediante su flujo soportado, inspeccionar el grafo y el reporte generados según `AGENTS.md`, y actualizar `MEMORY.md` con el estado final. No ejecutar esta tarea antes de completar todas las anteriores.

  **Hecho cuando:** Graphify se generó una sola vez y sus salidas previstas se inspeccionaron; `MEMORY.md` refleja la finalización y las comprobaciones, sin exceder 50 líneas.
