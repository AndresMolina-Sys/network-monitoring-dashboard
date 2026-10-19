# Plan 004 — Comparación de nodos

Estado: Pendiente de aprobación

## Enfoque técnico

Implementar la comparación en el frontend, conservando `NetworkMonitoringService` como límite de datos. El inventario permitirá seleccionar de dos a tres nodos sin anidar controles interactivos en el enlace existente de cada tarjeta. Un botón de acción navegará a `/compare` con los identificadores seleccionados en parámetros de URL; volver al inventario conservará esa selección para poder completarla. Una selección inválida mostrará el requisito de dos nodos y no reutilizará resultados anteriores.

La nueva página iniciará en `1h` y consultará en paralelo `getNodeMetrics(nodeId, range, signal)` por cada nodo seleccionado. Cada nodo mantendrá su estado independiente. Las series de cada métrica usarán como coordenada horizontal el tiempo transcurrido desde el inicio de la ventana propia del nodo, calculado en UTC; tooltips y alternativa tabular conservarán el timestamp original. Se mostrarán dos gráficas agrupadas por métrica, con identidad de serie visible además del color, una tabla accesible con nodo, métrica, valor y timestamp, y la etiqueta “Simulated data” en todos los estados.

No se cambia el contrato del servicio, la API, las fixtures, los periodos ni el backend. Los endpoints actuales ya permiten pedir cada nodo y rango por separado. Las respuestas antiguas se ignorarán al cambiar selección o periodo; error, nodo no encontrado, vacío y datos inválidos se expondrán por nodo y no eliminarán resultados válidos de otros nodos.

## Trazabilidad RF y verificación

| Requisito | Responsabilidad                                                                                                                                           | Evidencia prevista                                                                                                                                                                                                |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-1      | Selección en `network-nodes-panel.tsx`; control independiente en `network-node-card.tsx`; ruta de comparación.                                            | `network-nodes-panel.test.tsx`: 2/3 seleccionables, cuarto bloqueado, menos de 2 impide continuar y permite volver a completar; Playwright confirma que solo aparecen los IDs elegidos.                           |
| RF-2      | `node-metrics-comparison-chart.tsx`: una serie identificada por nodo y métrica; coordenada por tiempo transcurrido, sin alinear timestamps UTC absolutos. | Pruebas de transformación/gráfica con muestras cuyos anclajes UTC difieren; etiquetas de serie y tooltip conservan identidad y timestamp originales.                                                              |
| RF-3      | Selector y carga compartidos de rango en la página y hook de comparación; reutilizar reglas de ventana de `use-node-metrics.ts`.                          | `use-node-comparison.test.ts` y prueba de página: inicio `1h`, selección de los tres rangos, llamadas iguales para todos los nodos y ventanas UTC ancladas individualmente con extremos incluidos.                |
| RF-4      | Estado independiente por nodo en `use-node-comparison.ts`.                                                                                                | Pruebas con un nodo fallido/no encontrado y otro válido, y con todos fallidos; comprobar estados diferenciados y ausencia de resultados obsoletos.                                                                |
| RF-5      | Validación por nodo reutilizando la validación actual de métricas.                                                                                        | Casos `it.each` de muestras incompletas, timestamps/valores inválidos, orden/duplicados, fuera de ventana, latencia negativa y pérdida fuera de 0–100%; nodo inválido en error y otros nodos válidos conservados. |
| RF-6      | Clasificación por nodo del resultado vacío, sin ancla y sin errores parciales.                                                                            | Pruebas del hook/página distinguen vacío de error y confirman que no se muestran datos anteriores.                                                                                                                |
| RF-7      | Página de comparación mantiene la etiqueta exacta en carga, éxito, vacío y error.                                                                         | Pruebas de página para cada estado y E2E del texto visible sin hover.                                                                                                                                             |
| RF-8      | Gráficas accesibles y tabla textual con nodo, métrica, valor y timestamp UTC.                                                                             | Pruebas de página verifican todos los registros; Storybook/axe y E2E comprueban nombres accesibles y acceso por teclado.                                                                                          |
| RF-9      | Cancelación/guardas de solicitudes en el hook ante cambios de nodos o rango y validación de selección antes de mostrar resultados.                        | Pruebas diferidas resuelven solicitudes fuera de orden; Playwright cambia rango durante la carga y confirma que solo permanece la selección vigente.                                                              |

## Archivos previstos

Modificar `src/features/network-monitoring/components/network-nodes-panel.tsx`, `network-node-card.tsx` y sus pruebas; `src/app/router.tsx`; `src/features/network-monitoring/hooks/use-node-metrics.ts` y su prueba para extraer y compartir la validación; `src/App.css`; y `e2e/network-monitoring.spec.ts`.

Crear `src/features/network-monitoring/hooks/use-node-comparison.ts` y su prueba; `src/features/network-monitoring/pages/network-node-comparison-page.tsx`, su prueba y story; `src/features/network-monitoring/components/node-metrics-comparison-chart.tsx` y story; además de `src/features/network-monitoring/metrics-validation.ts` y su prueba unitaria. No crear ni modificar archivos de API, contratos de dominio, configuración o dependencias salvo que la implementación demuestre una necesidad nueva; en ese caso, detenerse y pedir aprobación.

## Alternativas y riesgos

- **Ruta dedicada frente a comparación dentro del inventario:** se propone `/compare` con IDs en URL para separar la lectura analítica, soportar recarga y mantener navegación atrás/adelante. Riesgo: validar IDs repetidos, desconocidos o una selección menor a dos sin confiar en valores de URL.
- **Gráficas actuales frente a componente de comparación separado:** se propone un componente nuevo para varias series, preservando el comportamiento de los gráficos individuales. Riesgo: etiquetas y tooltips pueden saturarse en móvil; verificar 390 × 844 y dar preferencia a identificación textual, nunca solo color.
- **Validación duplicada frente a utilidad compartida:** extraer las reglas existentes evita divergencia entre detalle y comparación. Riesgo: el refactor puede afectar el detalle; las pruebas actuales de `use-node-metrics.test.ts` deben seguir cubriendo estados, ventanas y límites.
- **Solicitudes agrupadas frente a fan-out existente:** se propone una solicitud por nodo y rango en paralelo, limitada a tres, sin endpoint nuevo. Riesgo: más solicitudes HTTP por cambio de rango; el servicio ya admite aborto mediante `AbortSignal`.

## Verificación

Desde la raíz del repositorio, ejecutar `npm run format:check`, `npm run lint`, `npm run test`, `npm run build`, `npm run build-storybook`, `npm run test:e2e` y `npm run test:e2e:full-stack`. Playwright debe cubrir escritorio y móvil a 390 × 844 sin desbordamiento horizontal, incluida la navegación desde inventario, selección, periodos, fallos parciales y tabla accesible. No se requiere xUnit ni build de Docker mientras no cambien API, contrato o contenedor.

## Aprobaciones antes de implementar

Se requiere aprobación de este plan y luego aprobación separada de `tasks.md` antes de implementar. La aprobación debe incluir los archivos fuente nuevos enumerados, conforme a los límites de `AGENTS.md`. No se prevén dependencias nuevas, cambios de contrato, configuración, despliegues ni persistencia. Si alguno resulta necesario, detenerse y solicitar autorización específica.
