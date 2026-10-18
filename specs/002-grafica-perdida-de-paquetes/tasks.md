# Tasks 002 — Gráfica de pérdida de paquetes

Estado: Aprobado por el usuario

- [x] **T-001 — Crear la gráfica de pérdida de paquetes**

  **Estimación:** 30 min · **Dependencias:** Ninguna · **RF:** RF-2, RF-3, RF-4

  **Hecho cuando:** Primero se añade una prueba Storybook/Vitest y luego `NodePacketLossChart` con estilos delimitados; la prueba comprueba muestras de 0 %, 0.2 % y 100 %, eje fijo inclusivo 0–100 % y tooltip con timestamp y porcentaje correctos.

- [x] **T-002 — Integrar la gráfica en el detalle del nodo**

  **Estimación:** 25 min · **Dependencias:** T-001 · **RF:** RF-1, RF-2, RF-5, RF-6, RF-7, RF-8

  **Hecho cuando:** Primero se amplían las pruebas de página y luego se integra el componente entre la gráfica de latencia y la tabla; las pruebas verifican datos compartidos, etiqueta “Simulated data”, tabla intacta y ausencia de datos gráficos obsoletos en carga, vacío, error y nodo inexistente.

- [x] **T-003 — Añadir y ejecutar aceptación E2E local**

  **Estimación:** 25 min · **Dependencias:** T-002 · **RF:** RF-1, RF-2, RF-5, RF-7, RF-8

  **Hecho cuando:** Primero se amplía la suite E2E y luego `npm run test:e2e` pasa en Chromium de escritorio y móvil de 390 × 844 al recorrer `1h`, `24h` y `7d`; ambas gráficas y la tabla coinciden en periodo, conservan el orden aprobado, muestran la etiqueta y no hay desbordamiento horizontal.

- [x] **T-004 — Ejecutar verificaciones de calidad y compilación**

  **Estimación:** 25 min · **Dependencias:** T-001, T-002, T-003 · **RF:** RF-1 a RF-8

  **Hecho cuando:** `npm run format:check`, `npm run lint`, `npm run test`, `npm run build` y `npm run build-storybook` terminan correctamente; se registran los resultados reales y no se amplía el alcance ante fallos ajenos a esta spec.

- [x] **T-005 — Comprobar manualmente la versión de producción**

  **Estimación:** 15 min · **Dependencias:** T-004 y despliegue autorizado disponible · **RF:** RF-1, RF-3, RF-4, RF-5, RF-7, RF-8

  **Hecho cuando:** Después de un despliegue autorizado, se comprueban manualmente la gráfica, su escala, tooltip, sincronización con la tabla y etiqueta “Simulated data” en producción; si no hay versión desplegada autorizada, la tarea queda pendiente. No desplegar ni promover como parte de esta tarea.

  **Evidencia:** Las capturas de producción compartidas por el usuario muestran el selector `1h`/`24h`/`7d`, ambas gráficas, la tabla sincronizada, “Simulated data”, el tooltip de pérdida de paquetes y solicitudes HTTP 200 para los tres rangos. El usuario confirmó que CI y Vercel están en verde.
