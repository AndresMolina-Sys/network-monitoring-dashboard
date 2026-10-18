# Spec 002 — Gráfica de pérdida de paquetes

Estado: Pendiente de aprobación

## Contexto y objetivo

En el detalle de un nodo, la pérdida de paquetes ya aparece en la tabla de mediciones, pero no tiene una gráfica propia. Mostrarla junto a la latencia permitirá comparar visualmente ambas métricas del mismo nodo y periodo sin perder la tabla como alternativa textual accesible.

## Usuarios / actores

- Personas que consultan la salud y el rendimiento de los nodos del dashboard.

## Historias de usuario

- H1: Como persona que monitorea un nodo, quiero ver su pérdida de paquetes a lo largo del tiempo para comprender cómo se comporta durante el periodo seleccionado.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO las métricas de un nodo y periodo se cargan correctamente, EL SISTEMA muestra una gráfica de pérdida de paquetes debajo de la gráfica de latencia y antes de la tabla existente.
- RF-2: MIENTRAS hay un nodo y periodo seleccionados, EL SISTEMA representa en la gráfica cada muestra de pérdida de paquetes con su marca de tiempo correspondiente, usando los datos del mismo nodo y periodo que la gráfica de latencia y la tabla.
- RF-3: EL SISTEMA mantiene el eje vertical de la gráfica entre 0 % y 100 %, incluidos ambos extremos; si una muestra tiene un valor de 0 % o 100 %, la representa en el límite correspondiente, y representa los valores fraccionarios, como 0.2 %, de acuerdo con su valor recibido.
- RF-4: CUANDO la persona señala un punto de la gráfica, EL SISTEMA muestra en el tooltip la marca de tiempo y el porcentaje de pérdida de esa muestra, con el mismo estilo visual que el tooltip de latencia.
- RF-5: CUANDO la persona cambia entre 1h, 24h y 7d, EL SISTEMA sincroniza ambas gráficas y la tabla con el nodo y periodo seleccionados, sin mezclar muestras de periodos distintos.
- RF-6: SI las métricas están cargando, vacías o en error, o el nodo no existe, ENTONCES EL SISTEMA conserva el estado actual correspondiente y no muestra una gráfica de pérdida antigua ni datos de otra selección.
- RF-7: MIENTRAS se presenta el área de métricas durante la carga, el éxito, el estado vacío o el error, EL SISTEMA mantiene visible la etiqueta exacta “Simulated data”.
- RF-8: CUANDO las métricas se cargan correctamente, EL SISTEMA conserva la tabla existente con las marcas de tiempo, latencia y pérdida de paquetes de cada muestra como alternativa textual accesible a las gráficas.

## Requisitos no funcionales

- Los textos nuevos de la interfaz están en inglés; esta especificación está en español.
- Las mediciones se siguen identificando como simuladas y no se presentan como telemetría real.
- La aceptación incluye el modo local con mocks y una revisión manual del dashboard de producción después de un despliegue autorizado. Esta especificación no autoriza ni realiza un despliegue.

## Casos límite

- Los valores 0 % y 100 % deben caber en el eje y permanecer representables en sus límites; los valores fraccionarios deben conservarse en la gráfica y en el tooltip.
- Si todas las muestras del periodo tienen pérdida de 0 %, la gráfica sigue mostrándose en el límite inferior.
- Si cambia el periodo mientras se cargan métricas, no se muestran muestras de la selección previa como si pertenecieran a la actual.
- En carga, estado vacío, error o nodo no encontrado, se conserva el estado existente y no se muestra una gráfica obsoleta.
- La tabla continúa mostrando sus filas y los valores de pérdida correspondientes a las mismas muestras.

## Fuera de alcance

- Cambiar la gráfica de latencia, retirar o rediseñar la tabla, o añadir otro selector de periodo.
- Añadir periodos distintos de 1h, 24h y 7d.
- Modificar la API, el contrato de datos o las fixtures existentes.
- Incorporar telemetría real, persistencia o polling.
- Desplegar o promover la aplicación como parte de esta funcionalidad.

## Criterios de finalización

- RF-1 y RF-2: evidencia confirma que la gráfica aparece debajo de latencia y antes de la tabla, y que representa cada muestra y marca de tiempo del mismo nodo y periodo seleccionado.
- RF-3: evidencia confirma el eje fijo 0–100 % y la representación de límites y valores fraccionarios.
- RF-4: evidencia confirma que al señalar una muestra el tooltip presenta su marca de tiempo y porcentaje con el estilo de latencia.
- RF-5: evidencia confirma que al recorrer 1h, 24h y 7d ambas gráficas y la tabla muestran el mismo periodo y no mezclan datos.
- RF-6 y RF-7: evidencia confirma que se conservan los estados actuales, no aparece una gráfica obsoleta y la etiqueta exacta permanece visible durante carga, éxito, estado vacío y error.
- RF-8: evidencia confirma que la tabla contiene las muestras actuales con sus marcas de tiempo, latencia y pérdida de paquetes como alternativa textual accesible.
- La comprobación local con mocks funciona en los tres periodos y en viewport móvil de 390 × 844, sin desbordamiento horizontal.
- Después de un despliegue autorizado, una revisión manual de producción confirma la nueva gráfica y la etiqueta “Simulated data”; no se realiza ni autoriza el despliegue en esta fase.
- La funcionalidad no presenta las mediciones simuladas como telemetría real.

## Dudas abiertas

Ninguna identificada.
