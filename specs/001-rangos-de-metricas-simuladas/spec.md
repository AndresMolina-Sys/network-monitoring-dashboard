# Spec 001 — Rangos de métricas simuladas

Estado: Aprobado por el usuario

## Contexto y objetivo

Actualmente, el detalle de un nodo muestra métricas de la última hora. Ofrecer periodos de 1 hora, 24 horas y 7 días permitirá revisar su comportamiento en distintas ventanas; identificar las mediciones como simuladas evitará que se confundan con telemetría real.

## Usuarios / actores

- Personas que consultan la salud y el rendimiento de los nodos del dashboard.

## Historias de usuario

- H1: Como persona que monitorea nodos, quiero elegir un periodo de 1 hora, 24 horas o 7 días para revisar sus métricas en distintas ventanas de tiempo.
- H2: Como persona que consulta las métricas, quiero reconocer que son simuladas para no interpretarlas como telemetría real.
- H3: Como persona que cambia de periodo mientras se cargan métricas, quiero que se muestre el último periodo que elegí y no una respuesta anterior.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO una persona abre o recarga el detalle de un nodo, EL SISTEMA selecciona inicialmente el periodo de 1 hora y presenta los datos o el estado que corresponda a ese periodo.
- RF-2: CUANDO una persona selecciona 1 hora, 24 horas o 7 días, EL SISTEMA conserva esa selección y presenta únicamente las métricas correspondientes al nodo y al periodo seleccionados.
- RF-3: EL SISTEMA define cada periodo como una ventana móvil anclada a la muestra simulada más reciente del nodo seleccionado; interpreta las marcas de tiempo en UTC e incluye ambos extremos de la ventana.
- RF-4: EL SISTEMA ofrece para cada nodo y periodo un conjunto completo de muestras: cada 20 minutos durante 1 hora (4 muestras), cada hora durante 24 horas (25 muestras) y cada 6 horas durante 7 días (29 muestras), contando ambos extremos.
- RF-5: MIENTRAS se muestra el detalle de métricas, EL SISTEMA presenta el texto exacto “Simulated data” junto al periodo seleccionado y sin depender de hover, tanto durante la carga como en los estados de éxito, vacío y error.
- RF-6: MIENTRAS hay solicitudes de más de un periodo en curso, SI la persona selecciona otro periodo, ENTONCES EL SISTEMA muestra el resultado de la selección más reciente e impide que una respuesta anterior la reemplace.
- RF-7: SI el conjunto de un periodo está incompleto, contiene marcas de tiempo o valores ausentes o inválidos, incluye muestras fuera de la ventana, no sigue el orden cronológico estricto, repite marcas de tiempo, tiene latencia menor que cero o pérdida de paquetes fuera del intervalo inclusivo de 0 % a 100 %, ENTONCES EL SISTEMA trata el conjunto completo como un error, conserva el periodo seleccionado y no muestra ese conjunto como válido.
- RF-8: SI el nodo no dispone de ninguna muestra que permita anclar el periodo seleccionado y no existe un conjunto parcial o inválido que evaluar, ENTONCES EL SISTEMA conserva el periodo y muestra el estado vacío; EL SISTEMA no presenta el estado vacío como resultado normal de los datos de demostración.
- RF-9: SI falla la carga del periodo seleccionado o sus muestras no cumplen RF-7, ENTONCES EL SISTEMA conserva el periodo seleccionado y muestra el estado de error existente con una opción para reintentar; CUANDO un reintento vuelve a fallar, EL SISTEMA mantiene ese comportamiento sin cambiar de periodo.
- RF-10: SI no existe el nodo solicitado, ENTONCES EL SISTEMA conserva el estado existente de nodo no encontrado y no presenta la situación como un error de datos de un periodo.
- RF-11: EL SISTEMA permite consultar los tres periodos y reconocer su carácter simulado en el modo local con datos mock y en el dashboard de producción.

## Requisitos no funcionales

- La etiqueta “Simulated data” debe ser perceptible sin hover y permanecer visible en carga, éxito, vacío y error.
- La interfaz y sus mensajes mantienen el inglés, de acuerdo con el idioma actual de la aplicación.
- La aceptación de esta funcionalidad cubre el modo local con datos mock y el dashboard de producción.

## Casos límite

- Las muestras ubicadas exactamente en cualquiera de los extremos de la ventana son válidas; una muestra fuera de esos límites invalida el conjunto.
- La falta de cualquier muestra esperada según la cadencia invalida el conjunto; no se debe presentar como un rango válido ni como un estado vacío.
- Marcas de tiempo duplicadas, desordenadas o no interpretables, así como latencia negativa o pérdida menor que 0 % o mayor que 100 %, producen el estado de error y conservan el periodo elegido.
- Latencia igual a cero y pérdida de paquetes igual a 0 % o 100 % están dentro de los límites permitidos.
- Si una solicitud anterior termina después de que la persona seleccionó otro periodo, su respuesta no reemplaza la selección ni sus métricas.
- Una apertura nueva o recarga vuelve a iniciar en 1 hora; una selección posterior prevalece durante esa sesión de consulta.
- Si no existe ninguna muestra para anclar el periodo, el estado vacío es excepcional. Si existe un conjunto esperado al que le faltan muestras, corresponde el estado de error, no el estado vacío.
- Si el nodo no existe, se mantiene el estado de nodo no encontrado. Si los reintentos vuelven a fallar, se mantiene el estado de error y la posibilidad de reintentar.

## Fuera de alcance

- Aceptar datos de medición incompletos o inválidos, o sustituirlos silenciosamente por datos de otro periodo.
- Incorporar telemetría real, persistencia histórica, cálculo de uptime, alertas o autenticación.
- Usar el modo local conectado a la API como objetivo de aceptación.
- Usar despliegues de preview de Vercel como objetivo de aceptación.
- Añadir periodos distintos de 1 hora, 24 horas y 7 días.

## Criterios de finalización

- RF-1: evidencia observable confirma que abrir y recargar el detalle selecciona inicialmente 1 hora, incluso si el periodo presenta un estado de carga, vacío o error.
- RF-2: evidencia observable confirma que cada periodo muestra únicamente las métricas del nodo y periodo seleccionados.
- RF-3: evidencia observable confirma que cada ventana se ancla a la muestra más reciente del nodo, interpreta sus marcas de tiempo en UTC e incluye ambos extremos.
- RF-4: evidencia observable confirma que cada nodo ofrece conjuntos completos con las cadencias y cantidades acordadas para los tres periodos.
- RF-5: evidencia observable confirma que “Simulated data” está junto al periodo y visible sin hover en carga, éxito, vacío y error.
- RF-6: evidencia observable confirma que una selección más reciente prevalece sobre una respuesta anterior.
- RF-7: evidencia observable para cada categoría de dato inválido confirma el estado de error, sin cambiar el periodo ni presentar el conjunto como válido.
- RF-8: evidencia observable confirma el estado vacío cuando no hay muestra que permita anclar el periodo, y que no se usa por falta parcial de muestras.
- RF-9: evidencia observable confirma que los fallos y reintentos repetidos mantienen el periodo seleccionado y la opción para reintentar.
- RF-10: evidencia observable confirma que un nodo inexistente conserva el estado diferenciado de nodo no encontrado.
- RF-11: evidencia observable confirma la consulta de los tres periodos y su identificación como simulados en modo local con datos mock y en el dashboard de producción.
- La funcionalidad no presenta los datos simulados como telemetría real.

## Dudas abiertas

- Ninguna identificada; las decisiones de alcance y comportamiento de esta versión están confirmadas.
