# Tasks 003 — Rediseño visual integral del dashboard

Estado: Pendiente de aprobación

Las estimaciones indican trabajo activo y no incluyen el tiempo de espera de aprobaciones. Todas las tareas permanecen sin aprobar ni completar. Después de aprobar este checklist, cada tarea de implementación requerirá una solicitud explícita y se ejecutará de forma serial. Un único implementador conservará la propiedad de escritura de `src/App.css` durante toda la spec.

En cada tarea de implementación se ejecuta primero la prueba dirigida pertinente y después se revisa la story aplicable. Si se modifica comportamiento observable, se escribe o ajusta primero su prueba. No se avanza a otra tarea si falla una verificación.

- [ ] **T-001 — Generar y presentar direcciones visuales**
      **Estimación:** 25 min · **Dependencias:** Ninguna · **RF:** RF-1, RF-13
      Ejecutar el flujo Impeccable aprobado `concept-seed --scope direction --mode operate`; no editar la interfaz.
      **Hecho cuando:** Se presentan las direcciones generadas y la persona usuaria selecciona y aprueba explícitamente una antes de continuar.

- [ ] **T-002 — Obtener y aprobar referencia code-first del inventario**
      **Estimación:** 25 min · **Dependencias:** T-001 · **RF:** RF-1, RF-2, RF-12, RF-13
      Revisar primero si la dirección aprobada trae una referencia específica para `/`; si no, usar `concept-seed --scope surface --mode operate` en esa superficie. Solo si no produce boceto HTML, usar el fallback oficial `serve-question --schema`.
      **Hecho cuando:** Se presenta una referencia visual identificada con `/` y la persona usuaria la aprueba explícitamente; no se inicia código.

- [ ] **T-003 — Obtener y aprobar referencia code-first del detalle**
      **Estimación:** 25 min · **Dependencias:** T-001 · **RF:** RF-1, RF-4, RF-12, RF-13
      Revisar primero si la dirección aprobada trae una referencia específica para `/nodes/:nodeId`; si no, usar `concept-seed --scope surface --mode operate` en esa superficie. Solo si no produce boceto HTML, usar el fallback oficial `serve-question --schema`.
      **Hecho cuando:** Se presenta una referencia independiente identificada con `/nodes/:nodeId` y la persona usuaria la aprueba explícitamente; no se inicia código.

- [ ] **T-004 — Registrar y releer el contrato visual**
      **Estimación:** 25 min · **Dependencias:** T-002, T-003 · **RF:** RF-13
      Resolver la ubicación mediante `surface-brief read src/App.tsx`; escribir con el comando oficial el contrato aprobado de seis bloques (`THESIS`, `OWN-WORLD`, `STORY`, `FIRST VIEWPORT`, `FORM`, `FINISH`) y asociar las dos referencias usando solo el formato soportado.
      **Hecho cuando:** Una lectura posterior confirma los seis bloques y las asociaciones aprobadas para inventario y detalle; si la herramienta no puede registrarlas, se detiene y se consulta al usuario.

- [ ] **T-005 — Auditar la interfaz existente antes del build**
      **Estimación:** 25 min · **Dependencias:** T-004 · **RF:** RF-2, RF-3, RF-4, RF-6, RF-8, RF-9, RF-10, RF-11, RF-12
      Realizar una revisión independiente de solo lectura de scanability, funciones existentes, estados, accesibilidad y riesgos visuales; usar el perfil revisor cuando esté disponible. Si no hay subagentes, el coordinador asume el rol en una pasada separada y lo declara.
      **Hecho cuando:** El coordinador recibe un informe de línea base con riesgos y campos/acciones que deben seguir localizables, sin modificaciones de archivos.

- [ ] **T-006 — Abrir el build gate de Impeccable**
      **Estimación:** 20 min · **Dependencias:** T-005 · **RF:** RF-13
      Confirmar aprobación del checklist, de la dirección, de ambas referencias y de la brief releída; iniciar el build gate conforme a Impeccable.
      **Hecho cuando:** El gate confirma que se puede comenzar el build y todas las aprobaciones requeridas están explícitas; si falta alguna, el trabajo visual permanece bloqueado.

- [ ] **T-007 — Establecer la base visual y el marco de página**
      **Estimación:** 25 min · **Dependencias:** T-006 · **RF:** RF-1, RF-7, RF-10, RF-11, RF-12
      Actualizar la base visual en `src/index.css` y `src/App.css`, y aplicar el marco compartido en `src/App.tsx` sin fijar atributos distintos de la dirección aprobada.
      **Hecho cuando:** Las dos rutas usan la dirección aprobada y la identidad oscura es coherente; inventario y detalle conservan el reconocimiento honesto de datos de muestra/simulados. Ejecutar primero la prueba dirigida pertinente y revisar la story aplicable.

- [ ] **T-008 — Rediseñar tarjetas y lectura del inventario**
      **Estimación:** 25 min · **Dependencias:** T-007 · **RF:** RF-1, RF-2, RF-7, RF-12
      Ajustar `network-nodes-panel.tsx`, `network-node-card.tsx` y estilos existentes; preservar navegación, estado textual y todos los campos del nodo.
      **Hecho cuando:** Las pruebas/stories dirigidas pasan y nombre, estado, ID, dirección, ubicación y última comprobación se localizan sin hover ni animación; una tarjeta sigue llevando al detalle.

- [ ] **T-009 — Rediseñar controles y estados del inventario**
      **Estimación:** 25 min · **Dependencias:** T-008 · **RF:** RF-3, RF-6, RF-7, RF-12
      Ajustar búsqueda, filtro, limpieza, recuperación sin coincidencias y componentes existentes de carga, vacío y error. Para cualquier cambio de comportamiento, escribir o ajustar primero la prueba correspondiente.
      **Hecho cuando:** Las pruebas dirigidas confirman resultados y recuperación de filtros, además de estados comprensibles sin contenido obsoleto; no se altera la lógica de búsqueda/filtro.

- [ ] **T-010 — Rediseñar resumen y navegación del detalle**
      **Estimación:** 25 min · **Dependencias:** T-007 · **RF:** RF-1, RF-4, RF-5, RF-6, RF-7, RF-12
      Ajustar encabezado, resumen del nodo y retorno al inventario en `network-node-details-page.tsx` y estilos existentes, conservando identidad del nodo y navegación.
      **Hecho cuando:** Las pruebas dirigidas confirman nombre, estado y datos del nodo, retorno y carga directa de ruta; textos e indicadores no afirman telemetría en vivo o persistencia.

- [ ] **T-011 — Rediseñar selector, resumen de métricas y etiqueta simulada**
      **Estimación:** 25 min · **Dependencias:** T-010 · **RF:** RF-4, RF-6, RF-7, RF-12
      Presentar de forma coherente los rangos existentes, el resumen, unidades y “Simulated data”, sin cambiar valores ni contratos. Escribir primero pruebas si se modifica comportamiento observable.
      **Hecho cuando:** Las pruebas confirman sincronía entre nodo/rango/valores, visibilidad de la etiqueta en estados aplicables y ausencia de métricas obsoletas.

- [ ] **T-012 — Rediseñar la gráfica de latencia**
      **Estimación:** 25 min · **Dependencias:** T-011 · **RF:** RF-4, RF-8, RF-9, RF-11, RF-12
      Aplicar la referencia aprobada a `node-latency-chart.tsx` y sus stories existentes; conservar tooltip, alternativa textual y asociación con el periodo.
      **Hecho cuando:** Pruebas y story dirigidas confirman valores, ejes, unidades, tooltip y alternativa tabular/accesible; la marca y sus etiquetas cumplen los criterios de contraste aplicables.

- [ ] **T-013 — Rediseñar la gráfica de pérdida y la tabla**
      **Estimación:** 25 min · **Dependencias:** T-012 · **RF:** RF-4, RF-8, RF-9, RF-11, RF-12
      Aplicar la dirección a `node-packet-loss-chart.tsx` y la tabla de mediciones; mantener los valores 0 %, 100 % y fraccionarios y su sincronía con latencia.
      **Hecho cuando:** Pruebas y story dirigidas confirman escala, valores, tooltip, marcas legibles y tabla textual con los puntos del nodo/rango seleccionados.

- [ ] **T-014 — Rediseñar estados del detalle y añadir la story vacía autorizada**
      **Estimación:** 25 min · **Dependencias:** T-011 · **RF:** RF-6, RF-7, RF-8, RF-12
      Ajustar carga, error, vacío y nodo inexistente; crear únicamente el archivo previamente autorizado `src/features/network-monitoring/pages/network-node-details-page.stories.tsx`, con nodo válido y métricas vacías mediante servicio inyectado.
      **Hecho cuando:** Tests y story confirman estados diferenciados, etiqueta simulada donde aplica y ausencia de datos obsoletos; el vacío del detalle se puede abrir en Storybook sin añadir rutas ni modo demo.

- [ ] **T-015 — Aplicar movimiento funcional y respetar movimiento reducido**
      **Estimación:** 25 min · **Dependencias:** T-008, T-009, T-010, T-011 · **RF:** RF-3, RF-5, RF-10
      Añadir solo transiciones sutiles ligadas a interacción/orientación y soporte `prefers-reduced-motion` en estilos existentes. Escribir primero la prueba E2E pertinente.
      **Hecho cuando:** La prueba con `page.emulateMedia({ reducedMotion: 'reduce' })` pasa y la revisión confirma que el contenido y las respuestas siguen disponibles sin movimiento no esencial.

- [ ] **T-016 — Verificar semántica, teclado y foco**
      **Estimación:** 25 min · **Dependencias:** T-009, T-012, T-013, T-014 · **RF:** RF-3, RF-4, RF-5, RF-8, RF-9
      Completar nombres/relaciones semánticas y foco visible solo donde las pruebas/revisión detecten brechas; conservar la alternativa tabular y stories de teclado existentes.
      **Hecho cuando:** Recorrido manual por teclado alcanza las acciones y gráficas, el foco es visible, los nombres se entienden y las pruebas/stories dirigidas pasan.

- [ ] **T-017 — Ajustar responsividad del inventario**
      **Estimación:** 25 min · **Dependencias:** T-008, T-009 · **RF:** RF-2, RF-3, RF-7, RF-11, RF-12
      Afinar estilos del inventario para tamaños estrechos, intermedios, zoom y contenido largo, preservando todos los campos y controles.
      **Hecho cuando:** Las verificaciones dirigidas en 375, 390, 768, 1024 y 1440 px no recortan contenido/acciones y `scrollWidth <= innerWidth`.

- [ ] **T-018 — Ajustar responsividad del detalle**
      **Estimación:** 25 min · **Dependencias:** T-010, T-011, T-012, T-013, T-014 · **RF:** RF-4, RF-6, RF-7, RF-11, RF-12
      Afinar resumen, selector, gráficas, tabla y estados en los tamaños cubiertos, sin modificar `playwright.config.ts`.
      **Hecho cuando:** Las verificaciones dirigidas en 375, 390 × 844, 768, 1024 y 1440 px mantienen utilizables controles y datos, sin desbordamiento horizontal de página.

- [ ] **T-019 — Completar pruebas E2E de aceptación**
      **Estimación:** 30 min · **Dependencias:** T-015, T-016, T-017, T-018 · **RF:** RF-2 a RF-12
      Ampliar solo `e2e/network-monitoring.spec.ts` para la matriz responsive, navegación, búsqueda/filtros, rangos, estados alcanzables, teclado y movimiento reducido; escribir primero cada aserción de comportamiento nueva.
      **Hecho cuando:** `npm run test:e2e` pasa para inventario y detalle en 375, 390, 768, 1024 y 1440 px; las pruebas verifican overflow, datos y acciones sin modificar la configuración E2E.

- [ ] **T-020 — Ejecutar una sola vez el detector Impeccable**
      **Estimación:** 20 min · **Dependencias:** T-019 · **RF:** RF-1, RF-8, RF-9, RF-10, RF-11, RF-12, RF-13
      Ejecutar `impeccable detect --json` una única vez sobre los targets realmente modificados y conservar sus resultados para revisión.
      **Hecho cuando:** El detector se ejecutó una vez, los findings se entregan al revisor y no se invoca de nuevo durante esta spec.

- [ ] **T-021 — Capturar superficies y estados con Chrome DevTools**
      **Estimación:** 30 min · **Dependencias:** T-019, T-020 · **RF:** RF-1, RF-2, RF-4, RF-6, RF-7, RF-11, RF-12, RF-13
      En una ronda batch, capturar inventario y detalle en desktop y 390 × 844 móvil, más la story de detalle vacío en ambos tamaños; capturar estados existentes adicionales solo donde las rutas actuales lo permitan.
      **Hecho cuando:** Cada captura parte de un estado estable, se abre y valida visualmente en `.impeccable/review/`, y consola/dimensiones no muestran errores ni contenido engañoso.

- [ ] **T-022 — Realizar revisión independiente de cierre visual**
      **Estimación:** 25 min · **Dependencias:** T-020, T-021 · **RF:** RF-1 a RF-13
      Solicitar al revisor independiente (o asumir ese rol en una pasada separada si no hay subagentes) evaluación de referencias, campos, estados, accesibilidad, contraste, teclado, movimiento reducido, overflow y consola.
      **Hecho cuando:** El coordinador recibe findings priorizados y una decisión verificable de si existe algún bloqueo; el revisor no modifica archivos ni aprueba por el usuario.

- [ ] **T-023 — Resolver findings de cierre en una ronda acotada**
      **Estimación:** 25 min · **Dependencias:** T-022 · **RF:** RF afectados por findings dentro de RF-1 a RF-13
      Si hay defectos dentro del alcance, corregirlos en un solo lote y hacer como máximo una ronda de confirmación visual. Si no hay findings, registrar esa evidencia sin editar.
      **Hecho cuando:** No quedan findings materiales dentro del alcance y la ronda de confirmación (si aplica) valida las correcciones; cualquier necesidad de ampliar alcance vuelve a aprobación SDD.

- [ ] **T-024 — Documentar el sistema visual y contrastes medidos**
      **Estimación:** 30 min · **Dependencias:** T-023 · **RF:** RF-1, RF-7, RF-9, RF-10, RF-12, RF-13
      Solo después de terminar el build, usar el documenter oficial de Impeccable para crear/actualizar `DESIGN.md` y `.impeccable/design.json` con el mundo visual realmente implementado.
      **Hecho cuando:** Los artefactos describen los tokens medidos y aprobados; `DESIGN.md` incluye por par relevante foreground/background, valores sRGB/hex, ratio medido, mínimo WCAG 2.2 AA y pasa/falla para texto, controles/foco, estados y marcas/ejes.

- [ ] **T-025 — Ejecutar verificación final del frontend**
      **Estimación:** 30 min · **Dependencias:** T-024 · **RF:** RF-1 a RF-13
      Ejecutar los comandos acordados: `npm run format:check`, `npm run lint`, `npm run test`, `npm run build`, `npm run build-storybook` y `npm run test:e2e`. No ejecutar xUnit ni full-stack si no cambió API/contrato.
      **Hecho cuando:** Todos los comandos previstos terminan correctamente, cualquier advertencia se reporta sin ocultarla y no se observan errores de interfaz en los flujos comprobados.

- [ ] **T-026 — Cerrar la spec y refrescar Graphify**
      **Estimación:** 30 min · **Dependencias:** T-001 a T-025 · **RF:** RF-1 a RF-13
      Como cierre final, y solo tras completar las tareas de dirección, build, revisión, documentación y verificación, refrescar Graphify una vez mediante su workflow soportado e inspeccionar grafo/reporte; después actualizar `MEMORY.md` y el coordinador prepara el commit local requerido con salidas generadas intencionadas.
      **Hecho cuando:** El grafo y reporte actualizados se inspeccionan, el diff contiene únicamente resultados previstos, `MEMORY.md` queda vigente y el coordinador crea el commit local; no se hace push ni deploy sin solicitud explícita.
