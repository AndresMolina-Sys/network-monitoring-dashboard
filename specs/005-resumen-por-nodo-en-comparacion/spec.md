# Spec 005 — Resumen por nodo en la comparación

Estado: Aprobado por el usuario

## Contexto y objetivo

La comparación permite revisar juntas las tendencias de varios nodos, pero para identificar rápidamente sus diferencias es necesario interpretar cada gráfica. Un resumen compacto por nodo mostrará las métricas principales del periodo elegido y facilitará reconocer qué nodos requieren una revisión más detallada, sin presentar los datos simulados como telemetría real.

## Usuarios / actores

- Personas que comparan el rendimiento de dos o tres nodos en el dashboard.

## Historias de usuario

- H1: Como persona que compara nodos, quiero ver sus métricas principales en tarjetas individuales para reconocer rápidamente sus diferencias.
- H2: Como persona que consulta un resumen, quiero saber a qué nodo y periodo corresponde cada valor para interpretarlo correctamente.
- H3: Como persona que compara nodos, quiero distinguir los datos válidos de los estados fallidos o pendientes para no basar decisiones en información obsoleta.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO se abre la comparación, EL SISTEMA selecciona inicialmente el periodo `1h`; CUANDO la persona selecciona `1h`, `24h` o `7d`, EL SISTEMA actualiza las tarjetas de resumen junto con las gráficas y la tabla para mostrar únicamente las muestras del periodo seleccionado.
- RF-2: CUANDO un nodo seleccionado tiene un conjunto válido y no vacío de métricas para el periodo vigente, EL SISTEMA muestra una sola tarjeta de resumen para ese nodo.
- RF-3: EL SISTEMA muestra en cada tarjeta la latencia de la muestra con el timestamp más reciente del periodo, la media aritmética de la latencia de todas sus muestras y la pérdida máxima de paquetes de sus muestras.
- RF-4: EL SISTEMA presenta esos valores con las mismas unidades y reglas de formato que el resumen del detalle del nodo: milisegundos para latencia, porcentaje para pérdida, hasta un decimal y sin ceros decimales innecesarios.
- RF-5: EL SISTEMA identifica cada tarjeta con el nombre reconocible del nodo y su ID; SI no hay un nombre reconocible disponible, ENTONCES EL SISTEMA identifica la tarjeta mediante el ID.
- RF-6: MIENTRAS se muestran las tarjetas, EL SISTEMA las ubica después de los controles del periodo y antes de las gráficas, conserva sus etiquetas identificables y permite consultarlas en pantallas móviles y de escritorio sin desbordamiento horizontal de la página.
- RF-7: SI las métricas de un nodo están cargando, vacías, fallidas, no encontradas o son inválidas, ENTONCES EL SISTEMA no crea una tarjeta para ese nodo ni muestra valores anteriores y conserva el estado correspondiente; EL SISTEMA mantiene las tarjetas de los demás nodos cuyos conjuntos sean válidos.
- RF-8: MIENTRAS cambia el periodo o la selección de nodos, EL SISTEMA muestra únicamente tarjetas calculadas con resultados de la selección y el periodo vigentes, sin conservar resúmenes obsoletos mientras llegan las nuevas métricas.
- RF-9: EL SISTEMA mantiene los textos de la interfaz en inglés e identifica las mediciones como simuladas mediante la identificación existente “Simulated data”.

## Requisitos no funcionales

- La presentación de las tarjetas es legible en pantallas móviles y de escritorio; a 390 × 844 píxeles la página no presenta desbordamiento horizontal.
- El resumen conserva el carácter de demostración de las mediciones y no comunica que sean telemetría en vivo.

## Casos límite

- Si solo algunos nodos tienen métricas válidas, cada uno de ellos conserva su tarjeta y los nodos con estados no exitosos mantienen sus estados existentes sin tarjeta.
- Si ningún nodo tiene métricas válidas, no se muestra ninguna tarjeta de resumen.
- Al cambiar de periodo, los valores del periodo anterior dejan de mostrarse durante la carga y no reaparecen si la nueva solicitud falla.
- Una latencia o pérdida igual a cero se presenta con su unidad; los valores enteros no muestran decimales innecesarios y los valores fraccionarios muestran como máximo un decimal.
- Si el nombre del nodo está ausente o no está disponible, el ID sigue permitiendo reconocer la tarjeta.
- Si las respuestas de distintos nodos llegan en momentos diferentes, ninguna respuesta de un periodo o selección anterior reemplaza los resúmenes vigentes.

## Fuera de alcance

- Añadir métricas distintas de latencia más reciente, latencia promedio y pérdida máxima de paquetes; en particular, uptime, rankings, deltas o agregados entre nodos.
- Modificar la selección de nodos, los periodos existentes, las gráficas o la tabla de comparación.
- Cambiar contratos, endpoints o datos de prueba, o incorporar telemetría real, persistencia, alertas, autenticación o polling.
- Desplegar o promover la aplicación como parte de esta funcionalidad.

## Criterios de finalización

- RF-1: evidencia confirma que la comparación inicia en `1h` y que las tarjetas, las gráficas y la tabla corresponden conjuntamente a cada periodo seleccionado.
- RF-2: evidencia confirma que hay exactamente una tarjeta por cada nodo con métricas válidas y no vacías.
- RF-3: evidencia confirma que la última latencia procede de la muestra con timestamp más reciente, el promedio incluye todas las muestras del periodo y la pérdida máxima corresponde al mayor valor de ese conjunto.
- RF-4: evidencia confirma unidades correctas, precisión máxima de un decimal y ausencia de ceros decimales innecesarios.
- RF-5: evidencia confirma que cada tarjeta muestra nombre e ID y que solo muestra el ID cuando el nombre no está disponible.
- RF-6: evidencia confirma el orden de las tarjetas respecto de controles y gráficas, su legibilidad en escritorio y móvil, y ausencia de desbordamiento horizontal a 390 × 844 píxeles.
- RF-7: evidencia confirma que estados de carga, vacío, error, nodo inexistente y datos inválidos no producen tarjetas ni valores antiguos, mientras los nodos válidos siguen resumidos.
- RF-8: evidencia confirma que un cambio de periodo o selección no deja visibles resúmenes de resultados anteriores durante la carga ni tras un fallo.
- RF-9: evidencia confirma que la interfaz está en inglés y conserva la identificación “Simulated data”.
- La funcionalidad no presenta las mediciones simuladas como telemetría real ni incorpora capacidades fuera del alcance aprobado.

## Dudas abiertas

- Ninguna identificada; el alcance y el comportamiento de esta versión están confirmados.
