# Spec 004 — Comparación de nodos

Estado: Pendiente de aprobación

## Contexto y objetivo

El inventario contiene nodos con mediciones simuladas, y su detalle permite revisar las tendencias de un nodo a la vez. Comparar entre dos y tres nodos seleccionados durante un mismo periodo permitirá detectar diferencias en latencia y pérdida de paquetes, manteniendo claro que los datos son de demostración.

## Usuarios / actores

- Personas que consultan y comparan el estado y el rendimiento de los nodos del dashboard.

## Historias de usuario

- H1: Como persona que explora el dashboard, quiero seleccionar dos o tres nodos del inventario para comparar sus métricas en un mismo periodo y detectar diferencias.
- H2: Como persona que consulta la comparación, quiero distinguir cada nodo y sus métricas para interpretar correctamente las tendencias.
- H3: Como persona que consulta los datos, quiero saber que las mediciones son simuladas y reconocer claramente si un nodo no pudo cargarse.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO la persona selecciona dos o tres nodos disponibles en el inventario e inicia la comparación, EL SISTEMA presenta únicamente esos nodos; SI al iniciar, durante la carga o durante la comparación hay menos de dos seleccionados, ENTONCES EL SISTEMA impide iniciar o continuar, no presenta resultados anteriores e indica que se requiere seleccionar al menos dos, manteniendo disponible la selección desde el inventario; EL SISTEMA no permite incluir más de tres.
- RF-2: MIENTRAS hay mediciones disponibles, EL SISTEMA presenta las tendencias de latencia y pérdida de paquetes agrupadas por métrica, con una serie distinguible por nodo seleccionado mediante su identificación y no solo por color. EL SISTEMA alinea el eje horizontal por el tiempo transcurrido dentro del rango propio de cada nodo, conserva las marcas de tiempo UTC de cada muestra para sus valores, la tabla y los tooltips, y no usa la hora UTC absoluta para alinear series entre nodos.
- RF-3: CUANDO la persona abre la comparación, EL SISTEMA selecciona inicialmente el periodo 1h, igual que en el detalle del nodo; CUANDO la persona selecciona 1h, 24h o 7d, EL SISTEMA aplica la misma duración de periodo a todos los nodos seleccionados y actualiza conjuntamente sus tendencias. Para cada nodo, la ventana se ancla a su muestra simulada más reciente según la definición vigente de periodos, interpreta sus marcas de tiempo en UTC e incluye los extremos de esa ventana. EL SISTEMA conserva los timestamps propios de cada muestra y no implica que los límites temporales exactos coincidan entre nodos.
- RF-4: SI falla la carga de un nodo seleccionado o este deja de estar disponible entre la selección y la carga, ENTONCES EL SISTEMA marca ese nodo con el estado correspondiente de error o no encontrado y conserva las tendencias válidas de los demás; EL SISTEMA no oculta el fallo ni lo sustituye con datos anteriores. SI fallan todos los nodos, ENTONCES EL SISTEMA muestra el estado correspondiente para cada uno y no presenta tendencias obsoletas.
- RF-5: SI el conjunto esperado de un nodo está incompleto o contiene una muestra con timestamp o valor ausente o inválido, una muestra fuera de la ventana, timestamps desordenados o duplicados, latencia menor que cero o pérdida de paquetes fuera del intervalo inclusivo de 0 % a 100 %, ENTONCES EL SISTEMA marca ese nodo con error, no presenta su serie como válida y conserva las tendencias válidas de los demás; EL SISTEMA no trata un conjunto parcial o inválido como vacío.
- RF-6: SI no existe ninguna muestra de un nodo que permita anclar su periodo y tampoco existe un conjunto parcial o inválido que evaluar, ENTONCES EL SISTEMA muestra para ese nodo el estado sin datos y no presenta mediciones obsoletas; EL SISTEMA conserva las tendencias válidas de los demás nodos seleccionados.
- RF-7: MIENTRAS se muestra la comparación durante la carga, el éxito, un estado sin datos o un error, EL SISTEMA mantiene visible la identificación exacta “Simulated data” y no presenta las mediciones como telemetría real.
- RF-8: CUANDO hay mediciones disponibles, EL SISTEMA ofrece una alternativa textual accesible que permite identificar por nodo y métrica los valores y las marcas de tiempo UTC de las tendencias comparadas.
- RF-9: MIENTRAS se cargan mediciones, SI cambia la selección de nodos o el periodo, ENTONCES EL SISTEMA muestra únicamente los estados y resultados correspondientes a la selección vigente, sin datos obsoletos de una selección anterior.

## Requisitos no funcionales

- Los textos nuevos de la interfaz están en inglés; esta especificación está en español.
- La comparación funciona con los datos simulados existentes y conserva su identificación como demostración.
- Los nodos, métricas, controles y estados siguen siendo comprensibles en pantallas móviles y de escritorio, sin desbordamiento horizontal de la página.

## Casos límite

- Con cero o un nodo seleccionado no se inicia ni continúa la comparación; se indica el mínimo de dos y la selección desde el inventario permanece disponible para completar el conjunto permitido de dos o tres nodos.
- Si un nodo deja de estar disponible después de ser seleccionado, se muestra su estado de no encontrado o error; las tendencias de los otros nodos válidos permanecen disponibles.
- Un nodo inexistente y un nodo sin muestras se presentan como estados distintos; ninguno reutiliza datos de otra selección. Un conjunto parcial o inválido es un error del nodo, no un estado sin datos.
- Un conjunto esperado está incompleto, tiene timestamp o valor ausente o inválido, incluye muestras fuera de ventana, timestamps fuera de orden o duplicados, latencia negativa o pérdida de paquetes menor que 0 % o mayor que 100 %; el nodo afectado muestra error y las series válidas de otros nodos se conservan.
- El estado sin datos solo aplica cuando no hay muestra que permita anclar el periodo y no existe un conjunto parcial o inválido que evaluar.
- Al cambiar de periodo o de nodos mientras hay solicitudes pendientes, una respuesta anterior no reemplaza los resultados o estados de la selección más reciente.
- Todos los nodos usan la misma duración seleccionada, pero cada ventana se ancla a la muestra más reciente de su propio nodo. El eje horizontal compara el tiempo transcurrido dentro de cada ventana; se conservan timestamps UTC para valores, tabla y tooltip, sin usarlos para alinear series entre nodos.
- Los valores y marcas de tiempo de latencia y pérdida de paquetes corresponden al mismo nodo y periodo; las unidades y la identidad de cada serie permanecen distinguibles.

## Fuera de alcance

- Comparar más de tres nodos o periodos distintos entre nodos.
- Incorporar telemetría real, nuevos nodos o mediciones, persistencia, uptime, alertas, autenticación o polling.
- Cambiar los periodos existentes de 1h, 24h y 7d o alterar el significado de sus mediciones.
- Desplegar o promover la aplicación como parte de esta funcionalidad.

## Criterios de finalización

- RF-1: evidencia confirma que se comparan únicamente dos o tres nodos seleccionados desde el inventario, que no se puede añadir un cuarto y que con menos de dos la comparación no inicia o se detiene, no presenta resultados anteriores, indica el mínimo requerido y permite completar la selección desde el inventario.
- RF-2: evidencia confirma que las tendencias se agrupan por latencia y pérdida de paquetes; que cada serie se identifica por nodo y es distinguible sin depender solo del color; y que el eje horizontal alinea el tiempo transcurrido dentro del rango de cada nodo, mientras tabla, valores y tooltips conservan sus timestamps UTC sin alinear series por hora UTC absoluta.
- RF-3: evidencia confirma que la comparación abre inicialmente en 1h; que 1h, 24h o 7d aplica la misma duración a todos los nodos; y que cada ventana se ancla a la muestra más reciente de su propio nodo en UTC con extremos incluidos, sin afirmar límites exactos compartidos entre nodos.
- RF-4: evidencia confirma que un nodo con fallo de carga o no encontrado queda marcado, mientras las tendencias válidas de los demás siguen visibles; también confirma que si todos fallan no se muestran tendencias obsoletas.
- RF-5: evidencia por cada categoría de datos parciales o inválidos confirma el error del nodo, la ausencia de una serie presentada como válida y la conservación de las tendencias válidas de otros nodos; confirma que estos casos no se clasifican como vacíos.
- RF-6: evidencia confirma que el estado sin datos aparece únicamente si no existe muestra para anclar el periodo y no hay un conjunto parcial o inválido que evaluar, sin conservar mediciones obsoletas.
- RF-7: evidencia confirma que “Simulated data” permanece visible en los estados de carga, éxito, sin datos y error, sin presentar mediciones simuladas como telemetría real.
- RF-8: evidencia confirma que la alternativa textual accesible permite consultar valores y marcas de tiempo UTC por nodo y métrica.
- RF-9: evidencia confirma que cambios de nodos o periodo durante la carga no presentan respuestas obsoletas y que una selección inferior a dos detiene la comparación y solicita completar la selección.
- La verificación con datos simulados cubre los tres periodos y pantallas móviles y de escritorio; en 390 × 844 píxeles no hay desbordamiento horizontal de página.
- La funcionalidad no comunica capacidades de monitoreo en vivo ni oculta estados fallidos.

## Dudas abiertas

Ninguna identificada.
