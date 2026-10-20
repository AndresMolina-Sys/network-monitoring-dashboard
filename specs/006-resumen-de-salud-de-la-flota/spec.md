# Spec 006 — Resumen de salud de la flota

Estado: Aprobado por el usuario

## Contexto y objetivo

El inventario muestra los nodos, pero obliga a revisar cada uno para entender el estado general de la flota. Un resumen de conteos y métricas del último periodo permitirá reconocer rápidamente la distribución de estados y las mediciones de demostración disponibles, sin presentarlas como telemetría real.

## Usuarios / actores

- Personas que exploran el dashboard o evalúan su demostración full-stack.

## Historias de usuario

- H1: Como persona que consulta el inventario, quiero ver cuántos nodos están Online, Degraded y Offline para entender de un vistazo el estado de toda la flota.
- H2: Como persona que revisa las métricas de demostración, quiero ver la latencia promedio y la pérdida máxima del periodo fijo de una hora (1h) para reconocer el comportamiento general de los nodos.
- H3: Como persona que interpreta el resumen, quiero conocer la cobertura de las métricas y distinguir los datos simulados para entender sus límites.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO la lista de nodos se carga correctamente y contiene nodos, EL SISTEMA muestra, debajo del encabezado del inventario y antes de la búsqueda y los filtros, un conteo para cada estado Online, Degraded y Offline.
- RF-2: EL SISTEMA calcula los tres conteos sobre todos los nodos cargados; CUANDO cambia la búsqueda o el filtro, EL SISTEMA conserva esos conteos sin reducirlos a los resultados visibles.
- RF-3: CUANDO la persona activa el conteo Online, Degraded u Offline, EL SISTEMA aplica el filtro de estado correspondiente y sincroniza el selector existente; CUANDO la persona elige “All statuses”, EL SISTEMA restablece la vista sin filtro de estado.
- RF-4: CUANDO hay nodos cargados, EL SISTEMA obtiene sus métricas del periodo fijo `1h` y calcula la media aritmética de latencia y la pérdida máxima usando todas las muestras de los nodos cuyas respuestas forman conjuntos completos, válidos y no vacíos.
- RF-5: MIENTRAS presenta las métricas agregadas, EL SISTEMA muestra sus unidades (`ms` y `%`), la cobertura como `X/N` —donde `X` es el número de nodos con un conjunto completo, válido y no vacío, y `N` el total de nodos cargados— e identifica visiblemente los valores como “Simulated data”.
- RF-6: CUANDO la lista de nodos termina de cargarse, EL SISTEMA muestra los conteos sin esperar a las solicitudes de métricas y mantiene ambos KPI en estado de carga hasta que todas las solicitudes iniciales hayan terminado.
- RF-7: SI una solicitud de métricas falla, su respuesta está vacía o incompleta, contiene cualquier muestra no válida, o corresponde a un `nodeId` distinto del solicitado o a un periodo distinto de `1h`, ENTONCES EL SISTEMA considera fallida la respuesta completa de ese nodo, excluye todas sus muestras de ambos KPI y del numerador `X`, conserva el nodo en `N` y en los conteos de estado, e incluye esa solicitud entre las que se pueden reintentar.
- RF-8: SI ningún nodo proporciona un conjunto completo, válido y no vacío de métricas, ENTONCES EL SISTEMA muestra `—` para ambos KPI y una cobertura de `0/N`, conserva los conteos y permite reintentar únicamente las solicitudes fallidas o con respuestas no válidas.
- RF-9: CUANDO se reintentan solicitudes fallidas mientras existen métricas válidas, EL SISTEMA conserva los KPI y la cobertura válidos actuales hasta que las solicitudes reintentadas se resuelvan; después actualiza la agregación y la cobertura con los resultados válidos disponibles.
- RF-10: MIENTRAS la lista de nodos está cargando, falla o no contiene nodos, EL SISTEMA conserva respectivamente el estado de carga, error o vacío existente del inventario y no muestra conteos ni KPI de una lista anterior.

## Requisitos no funcionales

- Los textos y etiquetas de la interfaz permanecen en inglés; la identificación “Simulated data” es visible sin depender de hover.
- Los conteos se pueden activar mediante teclado y exponen nombres accesibles que identifican el estado y su cantidad.
- El resumen es legible en escritorio y móvil; a 390 × 844 píxeles no provoca desbordamiento horizontal.
- Los valores agregados no se describen como telemetría en vivo ni como indicadores de uptime.

## Casos límite

- La búsqueda puede no devolver resultados: los conteos siguen representando la flota cargada, mientras el inventario conserva su estado actual de “sin coincidencias”.
- Un nodo con respuesta vacía o incompleta, o cuyo conjunto contiene al menos una muestra no válida según las reglas vigentes, queda excluido por completo de ambos KPI y de `X`; no se filtran puntos individuales para conservar los demás. El nodo sí permanece incluido en `N` y en los conteos de estado, y su solicitud puede reintentarse.
- Una respuesta que identifica un `nodeId` distinto del nodo solicitado o un periodo distinto de `1h` es inválida como conjunto completo: no aporta muestras ni suma a `X`; el nodo permanece en `N` y en los conteos de estado, y la solicitud puede reintentarse.
- Si las solicitudes terminan en momentos distintos, los KPI permanecen en carga hasta que se resuelvan las solicitudes iniciales; el resumen final utiliza solo las respuestas válidas.
- Si una respuesta reintentada vuelve a fallar, se conserva el agregado válido existente y la cobertura refleja únicamente los nodos con datos válidos.
- Si la lista falla o está vacía, no hay población sobre la que calcular métricas y se mantiene el estado actual del inventario.

## Fuera de alcance

- Elegir otro periodo o cambiar el periodo fijo `1h`.
- Incorporar telemetría real, persistencia, polling, uptime o alertas.
- Cambiar endpoints, contratos, dependencias o los datos de demostración.
- Cambiar el comportamiento de búsqueda, los filtros existentes o los estados actuales del inventario.
- Desplegar o promover la aplicación como parte de esta funcionalidad.

## Criterios de finalización

- RF-1 y RF-2: evidencia confirma los conteos correctos para cada estado, independientes de la búsqueda y del filtro aplicado.
- RF-3: evidencia confirma que cada conteo activa el filtro sincronizado y que “All statuses” lo restablece.
- RF-4: evidencia confirma que ambos KPI usan el conjunto combinado de muestras de nodos con respuestas completas, válidas y no vacías; la latencia media no se calcula como media de medias por nodo y la pérdida máxima corresponde al mayor porcentaje del mismo conjunto.
- RF-5: evidencia confirma unidades, cobertura `X/N` y la identificación visible “Simulated data”.
- RF-6: evidencia confirma que los conteos aparecen al terminar la carga de la lista mientras los KPI siguen en carga hasta resolver las solicitudes iniciales.
- RF-7 y RF-8: evidencia confirma que una solicitud fallida o una respuesta vacía, incompleta, con cualquier muestra no válida, con `nodeId` distinto del solicitado o con periodo distinto de `1h` excluye todas las muestras de ese nodo; verifica agregación parcial, cobertura, valores `—` y `0/N` cuando ningún nodo aporta un conjunto válido, posibilidad de reintento y conservación de los conteos.
- RF-9: evidencia confirma que reintentar conserva los valores válidos existentes, solicita únicamente los nodos fallidos y actualiza el resultado al resolverse.
- RF-10: evidencia confirma que carga, error y vacío de la lista conservan el comportamiento existente y no muestran datos anteriores.
- Los requisitos no funcionales se verifican con evidencia de que los tres contadores reciben foco y pueden activarse por teclado, y de que sus nombres accesibles comunican el estado y la cantidad; una comprobación responsive a 390 × 844 píxeles confirma que no hay desbordamiento horizontal.

## Dudas abiertas

- Ninguna identificada; el periodo, las fórmulas, la cobertura, los reintentos y los estados quedan definidos para esta versión.
