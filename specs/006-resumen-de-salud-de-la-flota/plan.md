# Plan 006 — Resumen de salud de la flota

Estado: Pendiente de aprobación

## Enfoque

Mantener el límite existente `NetworkMonitoringService` y añadir el resumen solo en la vista de inventario con nodos cargados. Los conteos se derivan de la lista completa recibida; la búsqueda y el filtro actual siguen controlando únicamente los nodos visibles. Los contadores de estado serán controles accesibles que actualizan el mismo filtro usado por el selector, sin borrar la búsqueda.

Un hook dedicado solicitará en paralelo las métricas `1h` de cada nodo cargado. Reutilizará `assertValidMetricsResponse` y `assertValidMetricPoints`; una solicitud fallida, vacía, incompleta, inválida o que no coincida con el nodo o rango solicitado excluirá el conjunto entero de ese nodo. Las solicitudes iniciales mantendrán los KPI en carga hasta que todas se resuelvan. Para reintentos se consultarán solo los nodos fallidos, conservando entretanto los resultados válidos ya mostrados.

La agregación concatenará las muestras de todos los nodos válidos y aplicará `summarizeMetrics` y `formatMetricValue`: así la latencia es la media de todas las muestras —no la media de promedios por nodo— y la pérdida máxima usa el mismo conjunto. La cobertura será `nodos válidos / nodos cargados`. Si no hay conjuntos válidos, ambos KPI mostrarán `—`, cobertura `0/N` y la acción de reintento. El resumen identificará los valores con el texto visible “Simulated data”.

El hook dedicado concentra carga, validación, cobertura y reintentos, en lugar de repartir esas responsabilidades entre el panel y varios hooks por nodo. Se usarán cancelación y protección contra resultados obsoletos al desmontar o cambiar la población/servicio; no se añadirá una operación masiva ni se cambiará el contrato existente.

## Archivos previstos

- `src/features/network-monitoring/hooks/use-fleet-health-summary.ts` — nuevo hook para solicitudes `1h`, validación por nodo, estados iniciales y reintentos parciales, cobertura y agregación.
- `src/features/network-monitoring/hooks/use-fleet-health-summary.test.ts` — nuevas pruebas del hook, incluidas respuestas válidas e inválidas, fallos, reintentos, cancelación y protección contra datos obsoletos.
- `src/features/network-monitoring/components/network-nodes-panel.tsx` — integrar conteos y resumen de métricas tras el encabezado y antes de los filtros; conservar las salidas tempranas de carga, error y vacío.
- `src/features/network-monitoring/components/network-nodes-panel.test.tsx` — comprobar conteos, independencia de búsqueda, sincronización de filtros, ubicación y estados del inventario.
- `src/App.css` — estilos del resumen, estados de KPI y disposición responsive con la escala y breakpoints existentes.
- `e2e/network-monitoring.spec.ts` — ampliar los flujos existentes de inventario para escritorio, teclado, filtros y viewport móvil.

No se prevén archivos fuente adicionales. No se modificarán API, contratos, fixtures, dependencias, configuración, historias de Storybook ni documentación del producto.

## Mapeo RF → responsabilidad → evidencia

| Requisito | Responsabilidad                                                                                                                     | Evidencia prevista                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| RF-1      | El panel cuenta nodos por estado y presenta los tres conteos en el lugar acordado.                                                  | Pruebas del panel con la flota fixture; Playwright verifica el resumen visible.                                             |
| RF-2      | Los conteos se calculan de `nodes`, no de `filteredNodes`.                                                                          | Prueba del panel cambia búsqueda y filtro y confirma que los conteos no varían.                                             |
| RF-3      | Cada contador establece `statusFilter`; el selector refleja el mismo valor y “All statuses” lo limpia.                              | Pruebas del panel y Playwright para clic, selector y activación por teclado.                                                |
| RF-4      | El hook agrega muestras válidas combinadas de `1h`; el panel presenta media de latencia y pérdida máxima.                           | Pruebas del hook con valores distintos por nodo y muestra para detectar una media de medias; uso del formateador existente. |
| RF-5      | El panel muestra unidades, cobertura `X/N` y “Simulated data”.                                                                      | Pruebas del panel para cobertura completa y parcial, unidades y etiqueta visible sin hover.                                 |
| RF-6      | El hook separa la carga de lista de la carga agregada y no finaliza la carga KPI antes de resolver todas las solicitudes iniciales. | Pruebas diferidas del hook verifican conteos visibles y KPI aún en carga mientras queda una solicitud pendiente.            |
| RF-7      | Validación completa por nodo; conjuntos fallidos no participan en KPI ni en `X`, pero sí en `N` y conteos.                          | Pruebas del hook cubren rechazo, vacío, incompleto, muestra inválida, `nodeId` incorrecto y rango distinto de `1h`.         |
| RF-8      | El estado sin ningún conjunto válido muestra `—`, `0/N` y permite reintentar solo solicitudes fallidas.                             | Pruebas del hook verifican valores/cobertura y que el reintento no solicita nodos ya resueltos.                             |
| RF-9      | El reintento conserva resultados válidos y actualiza agregado/cobertura al terminar.                                                | Prueba diferida del hook verifica valores conservados durante el reintento y agregación posterior.                          |
| RF-10     | El panel mantiene sus estados de lista existentes y omite el resumen en carga, error y vacío.                                       | Pruebas del panel confirman ausencia del resumen y de datos anteriores en cada estado.                                      |

## Verificación

- Ejecutar `npm run format:check`, `npm run lint`, `npm run test` y `npm run build`.
- Ejecutar `npm run test:e2e` en escritorio y en el proyecto móvil de 390 × 844; verificar conteos, filtro y selector sincronizados, interacción por teclado, etiqueta simulada, KPI y ausencia de desbordamiento horizontal.
- No ejecutar xUnit ni `npm run test:e2e:full-stack`: el alcance no cambia API, contratos ni comportamiento entre capas. Las pruebas E2E usarán el servicio mock habitual.

## Riesgos y límites

- **Fan-out de solicitudes:** se realiza una solicitud `1h` por cada nodo ya cargado; se limita al inventario actual y se cancelan solicitudes al dejar de ser vigentes. No se introduce una API agregada ni un límite de nodos no especificado.
- **Respuestas parciales o tardías:** validación completa y aislamiento por nodo evitan contaminar resultados; pruebas con promesas diferidas cubren resolución fuera de orden y reintentos.
- **Agregación estadística:** promediar promedios por nodo produciría un resultado sesgado si cambia el número de muestras. La implementación debe aplanar las muestras válidas antes de calcular ambos KPI.
- **Alcance:** periodo fijo `1h`, datos simulados y estados de inventario actuales. No incluye telemetría real, polling, persistencia, uptime, alertas, cambios de contratos, endpoints o despliegue.
