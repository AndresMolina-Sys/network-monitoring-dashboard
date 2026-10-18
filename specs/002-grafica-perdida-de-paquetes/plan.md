# Plan 002 — Gráfica de pérdida de paquetes

Estado: Pendiente de aprobación

## Alcance y enfoque

Implementar los RF-1 a RF-8 de la Spec 002 con un componente dedicado `NodePacketLossChart`. Recibirá el mismo `NodeMetrics` que ya consume el detalle del nodo; no hará solicitudes propias ni mantendrá estado de nodo o periodo. La vista lo renderizará solo junto a las métricas exitosas, entre la gráfica de latencia y la tabla accesible. La etiqueta “Simulated data” y los estados existentes conservarán su comportamiento.

El contrato `NodeMetrics` ya contiene `packetLossPercent`; las fixtures mock y la API ya proporcionan esos valores para `1h`, `24h` y `7d`. No se requieren cambios de API, contrato, dominio, servicios, hook, selector, periodos, fixtures ni dependencias.

## Enfoque técnico

1. Crear `NodePacketLossChart` como componente separado, con `NodeMetrics` como entrada. Transformar todas las muestras recibidas conservando su timestamp y `packetLossPercent`; mantener el formato de etiquetas temporales usado por latencia según el rango.
2. Usar Recharts con una línea monotónica y tooltip del mismo estilo que la gráfica de latencia. Fijar el eje porcentual de 0 a 100, incluidos los extremos, y presentar el timestamp y el porcentaje del punto seleccionado.
3. Integrar el componente en `NetworkNodeDetailsPage` dentro de la rama de métricas exitosas, inmediatamente después de `NodeLatencyChart` y antes de la tabla. Pasarle sin transformación de selección el mismo `metrics` que ya alimenta la gráfica y la tabla; no alterar el selector ni sus estados de carga, vacío, error o nodo inexistente.
4. Añadir estilos delimitados para el nuevo gráfico y compartir las reglas visuales existentes de panel, ejes y tooltip. Los cambios CSS no deben cambiar la apariencia ni el comportamiento de otros componentes.
5. Mantener la tabla semántica existente como alternativa textual accesible y conservar el texto exacto “Simulated data”. Todos los textos nuevos de interfaz estarán en inglés.

## Archivos previstos

| Archivo                                                                         | Cambio previsto                                                                                                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/network-monitoring/components/node-packet-loss-chart.tsx`         | Nuevo componente de línea que consume `NodeMetrics`, usa pérdida de paquetes y fija el eje 0–100 %.                                                                 |
| `src/features/network-monitoring/components/node-packet-loss-chart.stories.tsx` | Nueva story con pruebas de interacción para puntos límite, fraccionarios y tooltip; Vitest ya ejecuta las stories en Chromium mediante el complemento de Storybook. |
| `src/features/network-monitoring/pages/network-node-details-page.tsx`           | Insertar la gráfica en el orden aprobado, pasando el mismo resultado exitoso de métricas.                                                                           |
| `src/features/network-monitoring/pages/network-node-details-page.test.tsx`      | Comprobar orden, datos/rango compartidos, tabla y ausencia del gráfico durante estados no exitosos.                                                                 |
| `src/App.css`                                                                   | Compartir las reglas visuales de gráfico/tooltip con selectores acotados, sin alterar estilos ajenos.                                                               |
| `e2e/network-monitoring.spec.ts`                                                | Extender la aceptación de rangos para validar segunda gráfica, sincronización, orden y viewport móvil.                                                              |

No se prevén cambios en `src/domain/network.ts`, `src/mocks/network-fixtures.ts`, `src/services/`, `backend/` ni en el hook de métricas.

## Trazabilidad de requisitos y evidencia

| RF   | Responsabilidades                                                                                                                          | Verificación prevista                                                                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-1 | `NetworkNodeDetailsPage` coloca `NodePacketLossChart` después de `NodeLatencyChart` y antes de la tabla.                                   | Prueba de página y Playwright verifican presencia y orden de las tres secciones.                                                                                            |
| RF-2 | El componente traza todos los puntos de `metrics.points`; cada valor conserva el timestamp del punto.                                      | Story/Vitest inspecciona el trazado de muestras; prueba de página verifica que el componente recibe el mismo nodo, rango y número de puntos que la vista.                   |
| RF-3 | `NodePacketLossChart` usa eje porcentual fijo 0–100 y dibuja los valores sin excluir extremos ni fracciones.                               | Story/Vitest usa datos de prueba locales con 0, 0.2 y 100; comprueba límites del eje y los valores representados. No modifica las fixtures compartidas.                     |
| RF-4 | El tooltip del componente usa el timestamp original y el porcentaje del punto, con presentación visual compartida con latencia.            | Story/Vitest interactúa con puntos 0, 0.2 y 100 y verifica timestamp y porcentaje en el tooltip.                                                                            |
| RF-5 | La página pasa el único `NodeMetrics` seleccionado a ambas gráficas y a la tabla.                                                          | Pruebas de página y Playwright recorren `1h`, `24h` y `7d`, comprobando rango, muestras y tabla sincronizados.                                                              |
| RF-6 | La rama de éxito existente sigue siendo la única que renderiza los gráficos; carga, vacío, error y nodo inexistente conservan sus estados. | Pruebas de página para cada estado confirman que no hay gráfica de pérdida ni datos del periodo previo; Playwright conserva la comprobación del estado de nodo inexistente. |
| RF-7 | La barra de métricas conserva la etiqueta exacta en carga, éxito, vacío y error.                                                           | Pruebas de página verifican etiqueta y visibilidad en cada estado; Playwright confirma texto visible en los tres periodos.                                                  |
| RF-8 | La tabla existente mantiene timestamps, latencia y packet loss como alternativa textual accesible.                                         | Pruebas de página y Playwright verifican encabezados y todas las filas del periodo.                                                                                         |

## Alternativas consideradas

- Se elige una gráfica separada frente a añadir una segunda serie al gráfico de latencia: respeta la decisión del usuario, mantiene la escala de cada métrica clara y evita reestructurar el componente actual.
- Se descarta un selector de métrica o una visualización con doble eje: la spec pide dos gráficas sincronizadas y un eje fijo específico para packet loss.
- Se reutiliza el `NodeMetrics` ya seleccionado frente a crear una consulta o fixture para la gráfica: ambas fuentes ya devuelven `packetLossPercent` con los timestamps y rangos actuales.
- Se comparten estilos existentes mediante reglas acotadas al gráfico frente a rediseñar estilos globales: mantiene consistencia sin alterar otras pantallas.

## Riesgos y mitigaciones

- Los valores pequeños, como 0.2 %, pueden quedar visualmente cerca del límite inferior con escala fija. Mantener el valor exacto en tooltip y tabla; no alterar el rango vertical aprobado.
- Las fixtures actuales no necesitan contener un punto de 100 %. Cubrir ese extremo con datos sintéticos locales de la story para probar el dominio sin modificar fixtures del producto.
- Selectores CSS demasiado generales podrían cambiar la gráfica de latencia. Limitar el alcance a clases de ambas gráficas y comprobar regresión visual de la story existente.
- Un estado de carga al cambiar de periodo podría dejar datos anteriores en pantalla si se renderiza fuera de la rama de éxito. Mantener ambas gráficas bajo la condición existente y probar respuestas/rangos cambiantes.
- El tooltip debe seguir mostrando el valor de la muestra correcta y no latencia. La interacción Storybook probará timestamp y porcentaje con datos distintivos.

## Estrategia de verificación

1. Vitest/Storybook: ejecutar `npm run test`; la nueva story usará una serie sintética con 0, 0.2 y 100, comprobará el eje fijo y verificará el tooltip al interactuar con puntos representativos. La story de latencia existente debe seguir pasando.
2. Página: ampliar `network-node-details-page.test.tsx` para comprobar el orden latencia → pérdida → tabla, el mismo nodo/rango/puntos para ambas gráficas y la tabla, y la ausencia de gráficas obsoletas en carga, vacío, error y nodo inexistente; comprobar la etiqueta en los estados establecidos por la spec.
3. Playwright mock: ejecutar `npm run test:e2e`; en Chromium desktop y `mobile-chromium` de 390 × 844 recorrer `1h`, `24h` y `7d`, verificar ambas gráficas visibles, el orden antes de la tabla, los conteos de filas, la etiqueta y ausencia de overflow horizontal.
4. Integración full-stack: ejecutar `npm run test:e2e:full-stack` como regresión opcional del flujo con el API local ya existente; no cambiar el contrato ni fixtures. No se requieren pruebas xUnit ni cambios de backend.
5. Calidad frontend y documentación: `npm run format:check`, `npm run lint`, `npm run build` y `npm run build-storybook`. No se modificará CI.
6. Producción: después de un despliegue que el usuario autorice por separado, revisar manualmente el gráfico y la etiqueta en el dashboard publicado. No desplegar, promover ni cambiar configuración durante esta fase o implementación.
