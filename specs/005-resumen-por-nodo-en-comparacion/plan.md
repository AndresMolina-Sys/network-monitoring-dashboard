# Plan 005 — Resumen por nodo en la comparación

Estado: Pendiente de aprobación

## Enfoque técnico

- Extraer los cálculos y el formato ya usados por el detalle a `src/features/network-monitoring/metrics-summary.ts`. El helper compartirá latencia más reciente, promedio, pérdida máxima, punto de pérdida máxima y formato numérico; así se conserva la anotación existente del detalle y se evita duplicar reglas.
- Reutilizar el helper en `network-node-details-page.tsx` y `network-node-comparison-page.tsx`. La comparación derivará los resúmenes únicamente de nodos en estado `success` con puntos válidos del rango actual; el hook existente seguirá siendo responsable de validación, estados y descarte de respuestas obsoletas.
- Obtener los nombres desde `NetworkMonitoringService.listNodes()` en la página de comparación. La carga del catálogo será independiente de las métricas: si falla, está pendiente o no contiene un nodo, la tarjeta usará su ID. No se modifica el contrato ni se agrega un endpoint.
- Renderizar una tarjeta por nodo resumible después de los controles del periodo y antes de las gráficas. Cada tarjeta mostrará nombre e ID, o solo el ID como respaldo, y los tres KPI definidos por la spec. Añadir estilos responsivos en `src/App.css`, con adaptación a una columna en móvil y texto largo que pueda ajustarse sin desbordar.

## Archivos y responsabilidades

- Nuevo `src/features/network-monitoring/metrics-summary.ts`: tipo y funciones puras compartidas para resumir y formatear puntos.
- `src/features/network-monitoring/pages/network-node-details-page.tsx` y su prueba: consumir el helper sin cambiar la composición del detalle ni su observación de pérdida máxima.
- `src/features/network-monitoring/pages/network-node-comparison-page.tsx` y su prueba: cargar el catálogo existente, resolver nombres con fallback al ID y mostrar solo tarjetas de datos válidos del estado actual.
- `src/App.css`: estilos de las tarjetas por nodo y su disposición responsiva.
- `e2e/network-monitoring.spec.ts`: aceptación del resumen en la comparación y del layout móvil.

## Trazabilidad de requisitos

| Requisito | Responsabilidad                                                                                                                      | Pruebas concretas                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-1      | La página de comparación mantiene `1h` inicial y deriva las tarjetas del mismo rango que gráficos y tabla.                           | `network-node-comparison-page.test.tsx`: inicio en `1h` y actualización a `24h`/`7d`; `use-node-comparison.test.ts`: limpieza de resultados al cambiar rango; E2E de selección de rangos en comparación. |
| RF-2      | La página produce exactamente una tarjeta por nodo `success` con métricas no vacías.                                                 | Pruebas de comparación para dos nodos válidos, mezcla de éxito/error y respuesta vacía; `use-node-comparison.test.ts` para respuestas vacías.                                                            |
| RF-3      | El helper calcula latencia más reciente por timestamp, promedio de todas las muestras y pérdida máxima, conservando el punto máximo. | Pruebas existentes de resumen del detalle para los tres rangos y pruebas de comparación con resultados esperados para cada nodo y periodo.                                                               |
| RF-4      | El helper comparte unidades y formato de hasta un decimal, sin ceros finales innecesarios.                                           | Aserciones existentes de `RANGE_SUMMARIES` en `network-node-details-page.test.tsx`; nuevas aserciones visibles de valores enteros y fraccionarios en la prueba de comparación.                           |
| RF-5      | La página resuelve nombre e ID con `listNodes()` y conserva el ID como respaldo ante catálogo fallido, tardío o sin coincidencia.    | `network-node-comparison-page.test.tsx`: catálogo disponible, sin coincidencia y promesa rechazada; verificar que el estado de métricas siga siendo independiente.                                       |
| RF-6      | La página coloca las tarjetas entre toolbar y gráficas; CSS limita el grid y permite ajuste del contenido en móvil.                  | Prueba de comparación para orden DOM; E2E a 390 × 844 y escritorio para visibilidad y ausencia de overflow horizontal.                                                                                   |
| RF-7      | La página omite KPI de nodos no exitosos sin ocultar tarjetas válidas; el hook conserva los estados existentes.                      | Pruebas de comparación para carga, vacío, error y nodos mixtos; `use-node-comparison.test.ts` para nodo inexistente y datos inválidos; E2E de datos válidos junto a nodo ausente/fallido.                |
| RF-8      | La comparación renderiza solo el snapshot vigente al cambiar selección o periodo.                                                    | Prueba con respuestas diferidas en `network-node-comparison-page.test.tsx`; pruebas existentes de selección/rango y respuestas fuera de orden en `use-node-comparison.test.ts`.                          |
| RF-9      | Se conserva la etiqueta “Simulated data” y toda la nueva copia visible queda en inglés.                                              | Prueba de comparación verifica la etiqueta durante carga y éxito y su permanencia al cambiar rango; E2E la comprueba en los rangos seleccionados.                                                        |

## Verificación

- Ejecutar pruebas Vitest dirigidas para `network-node-details-page.test.tsx`, `network-node-comparison-page.test.tsx` y `use-node-comparison.test.ts`; después `npm run format:check`, `npm run lint`, `npm run test` y `npm run build`.
- Ejecutar `npm run test:e2e` para la selección y comparación real en Chromium, incluidos los rangos `1h`, `24h` y `7d`, los estados parciales y el viewport móvil de 390 × 844.
- No se requieren pruebas xUnit ni full-stack: la spec no cambia API, contratos ni fixtures. No desplegar como parte de esta iniciativa.

## Riesgos y límites

- La carga del catálogo puede fallar aunque las métricas estén disponibles; el fallback al ID evita convertir ese fallo accesorio en un error de comparación.
- Mantener los KPI derivados de `comparison.nodes` vigente evita mostrar valores anteriores mientras se cargan cambios de selección o rango.
- Conservar `peakPacketLossPoint` en el resultado compartido evita romper la anotación de evidencia existente en el detalle.
- No añadir uptime, deltas, rankings, agregados entre nodos, dependencias, endpoints, cambios de contrato, persistencia, polling ni telemetría real.
