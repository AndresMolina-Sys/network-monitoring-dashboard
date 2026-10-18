# Tasks 003 — Rediseño visual integral del dashboard

Estado: Aprobado por el usuario

Las estimaciones indican trabajo activo y no incluyen el tiempo de espera de aprobaciones. T-001 y T-002 están completas; las tareas restantes requieren una solicitud explícita y se ejecutan de forma serial. Un único implementador conservará la propiedad de escritura de `src/App.css` durante toda la spec.

En cada tarea de implementación se ejecuta primero la prueba dirigida pertinente y después se revisa la story aplicable. Si se modifica comportamiento observable, se escribe o ajusta primero su prueba. No se avanza a otra tarea si falla una verificación.

- [x] **T-001 — Generar y presentar direcciones visuales**
      **Estimación:** 25 min · **Dependencias:** Ninguna · **RF:** RF-1, RF-13
      Ejecutar el flujo Impeccable aprobado `concept-seed --scope direction --mode operate`; no editar la interfaz.
      **Hecho cuando:** Se presentan las direcciones generadas y la persona usuaria selecciona y aprueba explícitamente una antes de continuar.

- [x] **T-002 — Obtener y aprobar referencia code-first del inventario**
      **Estimación:** 25 min · **Dependencias:** T-001 · **RF:** RF-1, RF-2, RF-12, RF-13
      Revisar primero si la dirección aprobada trae una referencia específica para `/`; si no, usar `concept-seed --scope surface --mode operate` en esa superficie. Solo si no produce boceto HTML, usar el fallback oficial `serve-question --schema`.
      **Hecho cuando:** Se presenta una referencia visual identificada con `/` y la persona usuaria la aprueba explícitamente; no se inicia código.

- [x] **T-003 — Obtener y aprobar referencia code-first del detalle**
      **Estimación:** 25 min · **Dependencias:** T-001 · **RF:** RF-1, RF-4, RF-12, RF-13
      Revisar primero si la dirección aprobada trae una referencia específica para `/nodes/:nodeId`; si no, usar `concept-seed --scope surface --mode operate` en esa superficie. Solo si no produce boceto HTML, usar el fallback oficial `serve-question --schema`.
      **Hecho cuando:** Se presenta una referencia independiente identificada con `/nodes/:nodeId` y la persona usuaria la aprueba explícitamente; no se inicia código.
      **Aprobación:** “Evidence Margin”, con la gráfica de latencia como foco y la pérdida/anotación en una columna lateral; aprobada para la composición de escritorio.

- [x] **T-004 — Registrar y releer el contrato visual**
      **Estimación:** 25 min · **Dependencias:** T-002, T-003 · **RF:** RF-13
      Resolver la ubicación mediante `surface-brief read src/App.tsx`; escribir con el comando oficial el contrato aprobado de seis bloques (`THESIS`, `OWN-WORLD`, `STORY`, `FIRST VIEWPORT`, `FORM`, `FINISH`) y asociar las dos referencias usando solo el formato soportado.
      **Hecho cuando:** Una lectura posterior confirma los seis bloques y las asociaciones aprobadas para inventario y detalle; si la herramienta no puede registrarlas, se detiene y se consulta al usuario.
      **Resultado:** `.impeccable/surfaces/src-app-tsx.md` registra los seis bloques y relaciona los dos HTML aprobados mediante `related_targets`.

- [x] **T-005 — Auditar la interfaz existente antes del build**
      **Estimación:** 25 min · **Dependencias:** T-004 · **RF:** RF-2, RF-3, RF-4, RF-6, RF-8, RF-9, RF-10, RF-11, RF-12
      Realizar una revisión independiente de solo lectura de scanability, funciones existentes, estados, accesibilidad y riesgos visuales; usar el perfil revisor cuando esté disponible. Si no hay subagentes, el coordinador asume el rol en una pasada separada y lo declara.
      **Hecho cuando:** El coordinador recibe un informe de línea base con riesgos y campos/acciones que deben seguir localizables, sin modificaciones de archivos.
      **Resultado:** El revisor delegado no devolvió informe; el coordinador hizo la pasada independiente de solo lectura. Hechos: nombre, estado, ID, dirección, ubicación, última comprobación, búsqueda/filtro/limpieza, navegación, reintento, selector, resumen, ambas gráficas y tabla completa están presentes; controles y gráficas tienen semántica, hay foco visible y se reduce movimiento. Riesgos por validar: el hero dominante puede retrasar controles; timestamps largos pueden verse densos en móvil; pérdidas inferiores a 0.5% quedan cerca de la base en escala 0–100%; el E2E de rangos comprueba 390/1440 px, no los anchos intermedios; falta medir contraste final.

- [x] **T-006 — Confirmar la ruta code-led de Impeccable**
      **Estimación:** 20 min · **Dependencias:** T-005 · **RF:** RF-13
      Confirmar aprobación del checklist, la dirección, ambas referencias y la brief releída; ejecutar `build-phase start` para respetar la ruta registrada. En code-led, seguir `new-work.md` sin comps ni fases de comp-led.
      **Hecho cuando:** La herramienta confirma `CODE-LED`, sin ronda de comps ni fases bloqueantes, y las aprobaciones requeridas están explícitas; si falta alguna, el trabajo visual permanece bloqueado.
      **Resultado:** `build-phase start --direction seed:107fcfd7b5a49f4c --artifact src/App.tsx` confirmó que no hay comp round ni phase gates; contrato, referencias y aprobaciones están registrados.

- [x] **T-007 — Establecer la base visual y el marco de página**
      **Estimación:** 25 min · **Dependencias:** T-006 · **RF:** RF-1, RF-7, RF-10, RF-11, RF-12
      Actualizar la base visual en `src/index.css` y `src/App.css`, y aplicar el marco compartido en `src/App.tsx` sin fijar atributos distintos de la dirección aprobada.
      **Hecho cuando:** Las dos rutas usan la dirección aprobada y la identidad oscura es coherente; inventario y detalle conservan el reconocimiento honesto de datos de muestra/simulados. Ejecutar primero la prueba dirigida pertinente y revisar la story aplicable.
      **Resultado:** Base carbón/papel/cobre, shell compacto de 1180 px y cabecera común aplicados a ambas rutas; se conserva “Simulated inventory” y “Simulated data”, y se eliminó la carga de fuentes externas. Router y story del panel pasan (2/2), al igual que lint, build, Prettier dirigido y `git diff --check`. `npm run format:check` global sigue señalando 49 archivos Impeccable no versionados, sin tocar. Los subagentes de implementación/revisión no entregaron un informe final; el coordinador verificó el diff por separado.

- [x] **T-008 — Rediseñar tarjetas y lectura del inventario**
      **Estimación:** 25 min · **Dependencias:** T-007 · **RF:** RF-1, RF-2, RF-7, RF-12
      Ajustar `network-nodes-panel.tsx`, `network-node-card.tsx` y estilos existentes; preservar navegación, estado textual y todos los campos del nodo.
      **Hecho cuando:** Las pruebas/stories dirigidas pasan y nombre, estado, ID, dirección, ubicación y última comprobación se localizan sin hover ni animación; una tarjeta sigue llevando al detalle.
      **Resultado:** Las tarjetas pasan a filas de roster, con rótulo y texto de estado, ID, IP monoespaciada, ubicación y fecha UTC legible; se conserva el enlace de fila completa. Se añadió cobertura visible de los campos y enlaces. Router y stories del panel/tarjeta pasan (15/15); navegación E2E en escritorio/móvil (2/2) y overflow móvil (2/2); lint, build, Prettier dirigido y `git diff --check` pasan. Se actualizó en E2E el encabezado esperado, que seguía apuntando al título anterior de T-007.

- [x] **T-009 — Rediseñar controles y estados del inventario**
      **Estimación:** 25 min · **Dependencias:** T-008 · **RF:** RF-3, RF-6, RF-7, RF-12
      Ajustar búsqueda, filtro, limpieza, recuperación sin coincidencias y componentes existentes de carga, vacío y error. Para cualquier cambio de comportamiento, escribir o ajustar primero la prueba correspondiente.
      **Hecho cuando:** Las pruebas dirigidas confirman resultados y recuperación de filtros, además de estados comprensibles sin contenido obsoleto; no se altera la lógica de búsqueda/filtro.
      **Resultado:** Se conservaron la lógica y los controles, se dio tratamiento visual cálido al panel, al estado sin resultados y a los estados de carga/vacío/error; el esqueleto ahora sigue el roster en filas. Las pruebas confirman limpieza de filtros, mensajes y ausencia de tarjetas obsoletas. Vitest completo: 107/107; stories dirigidas: 16/16; lint, build, Prettier dirigido y `git diff --check` pasan.

- [x] **T-010 — Rediseñar resumen y navegación del detalle**
      **Estimación:** 25 min · **Dependencias:** T-007 · **RF:** RF-1, RF-4, RF-5, RF-6, RF-7, RF-12
      Ajustar encabezado, resumen del nodo y retorno al inventario en `network-node-details-page.tsx` y estilos existentes, conservando identidad del nodo y navegación.
      **Hecho cuando:** Las pruebas dirigidas confirman nombre, estado y datos del nodo, retorno y carga directa de ruta; textos e indicadores no afirman telemetría en vivo o persistencia.
      **Resultado:** Se refinó la cabecera, el enlace de retorno y el resumen visual de nodo, preservando campos, estado y copia simulada. Prueba dirigida de detalle/router: 11/11; Playwright para navegación ida/vuelta y carga directa en Chromium de escritorio/móvil: 4/4; lint, build, Prettier dirigido y `git diff --check` pasan. No se agregaron afirmaciones de telemetría real ni persistencia.

- [x] **T-011 — Rediseñar selector, resumen de métricas y etiqueta simulada**
      **Estimación:** 25 min · **Dependencias:** T-010 · **RF:** RF-4, RF-6, RF-7, RF-12
      Presentar de forma coherente los rangos existentes, el resumen, unidades y “Simulated data”, sin cambiar valores ni contratos. Escribir primero pruebas si se modifica comportamiento observable.
      **Hecho cuando:** Las pruebas confirman sincronía entre nodo/rango/valores, visibilidad de la etiqueta en estados aplicables y ausencia de métricas obsoletas.
      **Resultado:** Se armonizaron el selector, los valores del resumen y la etiqueta persistente con la paleta cobre, sin modificar lógica, unidades, rangos ni textos. Las pruebas del detalle confirman sincronía, etiqueta en carga/éxito/vacío/error y ausencia de métricas anteriores (10/10); lint, build, Prettier dirigido y `git diff --check` pasan.

- [x] **T-012 — Rediseñar la gráfica de latencia**
      **Estimación:** 25 min · **Dependencias:** T-011 · **RF:** RF-4, RF-8, RF-9, RF-11, RF-12
      Aplicar la referencia aprobada a `node-latency-chart.tsx` y sus stories existentes; conservar tooltip, alternativa textual y asociación con el periodo.
      **Hecho cuando:** Pruebas y story dirigidas confirman valores, ejes, unidades, tooltip y alternativa tabular/accesible; la marca y sus etiquetas cumplen los criterios de contraste aplicables.
      **Resultado:** Se aplicó la paleta cobre a la serie y se afinó el marco, la cuadrícula y los ejes. La story comprueba nombre accesible, ticks/unidades, muestras y navegación/tooltip por teclado; la prueba de página mantiene la tabla alternativa. Stories y pruebas de detalle: 12/12; contraste calculado contra la superficie: etiquetas 7.81:1 y línea 8.12:1; lint, build, Prettier dirigido y `git diff --check` pasan.

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

- [ ] **T-019 — Verificar la matriz responsive con Playwright**
      **Estimación:** 25 min · **Dependencias:** T-017, T-018 · **RF:** RF-2, RF-3, RF-4, RF-6, RF-11, RF-12
      Ampliar solo `e2e/network-monitoring.spec.ts` para comprobar inventario y detalle a 375, 390, 768, 1024 y 1440 px, sin cambiar la configuración E2E.
      **Hecho cuando:** Las pruebas dirigidas verifican en cada ancho que datos y controles esenciales no se recortan, que las acciones principales siguen utilizables y que `scrollWidth <= innerWidth`.

- [ ] **T-020 — Verificar navegación y búsqueda del inventario con Playwright**
      **Estimación:** 25 min · **Dependencias:** T-009, T-017 · **RF:** RF-3, RF-5, RF-6
      Completar o ajustar en `e2e/network-monitoring.spec.ts` el recorrido de inventario a detalle y regreso, búsqueda, filtro por estado, limpieza y recuperación de una lista sin coincidencias.
      **Hecho cuando:** Las pruebas confirman navegación y recuperación con los controles existentes, sin introducir rutas, filtros ni capacidades nuevas.

- [ ] **T-021 — Verificar sincronización del periodo seleccionado**
      **Estimación:** 25 min · **Dependencias:** T-011, T-013, T-018 · **RF:** RF-4, RF-7
      Completar o ajustar las pruebas Playwright de la página de detalle para seleccionar `1h`, `24h` y `7d` y comprobar el contenido visible asociado al rango actual.
      **Hecho cuando:** Para los tres rangos, las pruebas confirman que selector, título, resumen, ambas gráficas y tabla muestran el mismo nodo y periodo, y que “Simulated data” sigue visible.

- [ ] **T-022 — Verificar con Playwright solo los estados alcanzables**
      **Estimación:** 20 min · **Dependencias:** T-014, T-018 · **RF:** RF-6, RF-7
      En `e2e/network-monitoring.spec.ts`, comprobar el nodo inexistente y únicamente otros estados que las rutas, controles o escenarios ya existentes puedan exponer directamente. Para estados no navegables en E2E, apoyarse en la cobertura existente de Vitest y Storybook; no añadir rutas, query flags ni modos de prueba.
      **Hecho cuando:** Las pruebas verifican los estados E2E realmente alcanzables sin contenido obsoleto; se confirma la cobertura existente para los estados no alcanzables y no se crea un mecanismo de acceso nuevo.

- [ ] **T-023 — Verificar teclado, foco y movimiento reducido**
      **Estimación:** 25 min · **Dependencias:** T-015, T-016 · **RF:** RF-3, RF-4, RF-5, RF-8, RF-10
      Completar o ajustar pruebas dirigidas de teclado/foco y movimiento reducido en `e2e/network-monitoring.spec.ts`, usando `page.emulateMedia({ reducedMotion: 'reduce' })` para el último caso.
      **Hecho cuando:** Las pruebas alcanzan las acciones pertinentes por teclado, comprueban foco perceptible y confirman que reducir movimiento no elimina información ni funcionalidad.

- [ ] **T-024 — Ejecutar una sola vez el detector Impeccable**
      **Estimación:** 20 min · **Dependencias:** T-019, T-020, T-021, T-022, T-023 · **RF:** RF-1, RF-8, RF-9, RF-10, RF-11, RF-12, RF-13
      Ejecutar `impeccable detect --json` una única vez sobre los targets realmente modificados y conservar sus resultados para revisión.
      **Hecho cuando:** El detector se ejecutó una vez, los findings se entregan al revisor y no se invoca de nuevo durante esta spec.

- [ ] **T-025 — Capturar superficies y estados con Chrome DevTools**
      **Estimación:** 30 min · **Dependencias:** T-019, T-020, T-021, T-022, T-023, T-024 · **RF:** RF-1, RF-2, RF-4, RF-6, RF-7, RF-11, RF-12, RF-13
      En una ronda batch, capturar inventario y detalle en desktop y 390 × 844 móvil, más la story de detalle vacío en ambos tamaños; capturar estados existentes adicionales solo donde las rutas actuales lo permitan.
      **Hecho cuando:** Cada captura parte de un estado estable, se abre y valida visualmente en `.impeccable/review/`, y consola/dimensiones no muestran errores ni contenido engañoso.

- [ ] **T-026 — Realizar revisión independiente de cierre visual**
      **Estimación:** 25 min · **Dependencias:** T-024, T-025 · **RF:** RF-1 a RF-13
      Solicitar al revisor independiente (o asumir ese rol en una pasada separada si no hay subagentes) evaluación de referencias, campos, estados, accesibilidad, contraste, teclado, movimiento reducido, overflow y consola.
      **Hecho cuando:** El coordinador recibe findings priorizados y una decisión verificable de si existe algún bloqueo; el revisor no modifica archivos ni aprueba por el usuario.

- [ ] **T-027 — Resolver findings de cierre en una ronda acotada**
      **Estimación:** 25 min · **Dependencias:** T-026 · **RF:** RF afectados por findings dentro de RF-1 a RF-13
      Limitar el trabajo a un lote de hasta 25 minutos y a los requisitos y archivos ya aprobados. Si no hay findings materiales, registrar esa evidencia sin editar; si los hay, corregirlos en el lote y realizar como máximo una ronda de confirmación visual.
      **Hecho cuando:** **Éxito:** no quedan findings materiales dentro del alcance y la ronda única (si aplica) confirma las correcciones. **Parada, sin completar:** si no se pueden resolver y verificar todos dentro de 25 minutos, si el tiempo se agota o si hace falta ampliar alcance o crear archivos no autorizados, detenerse, dejar la tarea sin marcar y devolver el bloqueo al coordinador para un seguimiento SDD aprobado por separado; no ampliar el trabajo automáticamente.

- [ ] **T-028 — Documentar el sistema visual y contrastes medidos**
      **Estimación:** 30 min · **Dependencias:** T-027 · **RF:** RF-1, RF-7, RF-9, RF-10, RF-12, RF-13
      Solo después de terminar el build, usar el documenter oficial de Impeccable para crear/actualizar `DESIGN.md` y `.impeccable/design.json` con el mundo visual realmente implementado.
      **Hecho cuando:** Los artefactos describen los tokens medidos y aprobados; `DESIGN.md` incluye por par relevante foreground/background, valores sRGB/hex, ratio medido, mínimo WCAG 2.2 AA y pasa/falla para texto, controles/foco, estados y marcas/ejes.

- [ ] **T-029 — Ejecutar verificaciones finales no E2E**
      **Estimación:** 30 min · **Dependencias:** T-028 · **RF:** RF-1 a RF-13
      Ejecutar `npm run format:check`, `npm run lint`, `npm run test`, `npm run build` y `npm run build-storybook`. No ejecutar xUnit ni full-stack si no cambió API/contrato. Si cualquier comando falla, detenerse y reportar el resultado; esta tarea no incluye diagnóstico ni correcciones.
      **Hecho cuando:** Todos los comandos terminan correctamente y las advertencias se reportan sin ocultarlas; ante un fallo, la tarea queda sin completar y el coordinador recibe el comando y resultado fallidos, sin iniciar reparaciones dentro de esta verificación.

- [ ] **T-030 — Ejecutar la suite E2E completa**
      **Estimación:** 30 min · **Dependencias:** T-019, T-020, T-021, T-022, T-023, T-029 · **RF:** RF-2 a RF-12
      Ejecutar únicamente `npm run test:e2e` como verificación integral final. Si falla, detenerse y reportar el resultado; esta tarea no incluye diagnóstico ni correcciones.
      **Hecho cuando:** La suite completa termina correctamente; ante un fallo, la tarea queda sin completar y el coordinador recibe el test y resultado fallidos para decidir el siguiente paso, sin reparar nada dentro de esta verificación.

## Cierre del coordinador (posterior al checklist)

Solo después de completar todas las tareas numeradas T-001 a T-030, el coordinador refresca Graphify una sola vez mediante su workflow soportado e inspecciona el grafo y el reporte generados. Después actualiza `MEMORY.md` y crea el commit local requerido, incluyendo únicamente salidas generadas intencionadas y verificadas. No hace push ni deploy sin solicitud explícita.
