# Spec 003 — Rediseño visual integral del dashboard

Estado: Pendiente de aprobación

## Contexto y objetivo

El Network Monitoring Dashboard es una demo full-stack de portfolio cuyas mediciones son simuladas. Su presentación actual puede evolucionar hacia una experiencia visual más cuidada y premium que haga más clara la lectura de la salud y el rendimiento de los nodos, sin ocultar el carácter demostrativo de los datos ni sacrificar las funciones existentes. El rediseño conservará el tema oscuro, podrá reorganizar la composición y aplicará una identidad visual coherente, jerarquía tipográfica funcional y movimiento sutil.

## Usuarios / actores

- Personas que exploran la demo para entender el estado y el rendimiento de los nodos.
- Personas que evalúan el proyecto como portfolio full-stack, incluidas personas reclutadoras y técnicas.

## Historias de usuario

- H1: Como persona que explora el dashboard, quiero identificar rápidamente cada nodo y sus datos principales para comparar su estado sin perderme en la presentación.
- H2: Como persona que consulta el detalle de un nodo, quiero interpretar con claridad sus métricas y tendencias para comprender el periodo seleccionado.
- H3: Como persona que evalúa el portfolio, quiero reconocer qué capacidades demuestra el producto y cuáles son datos simulados para no confundir la demo con un servicio de monitoreo real.
- H4: Como persona que usa teclado, lector de pantalla o una pantalla pequeña, quiero recorrer y comprender las mismas funciones para poder usar el dashboard sin depender de un dispositivo o modalidad de entrada específicos.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO una persona abre el inventario o el detalle de un nodo, EL SISTEMA presenta una identidad visual oscura, coherente y claramente distinguible entre jerarquías, superficies, texto y estados; la composición puede reorganizarse siempre que se conserven los contenidos y comportamientos requeridos por esta spec.
- RF-2: MIENTRAS se muestra el inventario, EL SISTEMA presenta el nombre y el estado de cada nodo de forma claramente distinguible, y permite localizar sin hover ni animación el identificador, la dirección, la ubicación y la última comprobación; el estado no se comunica solo mediante color y cada tarjeta conserva su navegación al detalle.
- RF-3: CUANDO una persona busca, filtra por estado, limpia los filtros o llega a una lista sin coincidencias, EL SISTEMA conserva esos controles y presenta el resultado correspondiente de forma perceptible y comprensible.
- RF-4: CUANDO una persona abre el detalle de un nodo, EL SISTEMA conserva el resumen del nodo, el selector de periodos `1h`, `24h` y `7d`, el resumen de métricas, las gráficas de latencia y pérdida de paquetes, y la tabla de mediciones; cada elemento continúa asociado al nodo y periodo seleccionados.
- RF-5: CUANDO una persona navega entre inventario y detalle o solicita volver al inventario, EL SISTEMA conserva la navegación existente y comunica con claridad la pantalla y el nodo que se está consultando.
- RF-6: SI el inventario o el detalle se encuentra cargando, vacío, en error, sin resultados de búsqueda o muestra un nodo inexistente, ENTONCES EL SISTEMA conserva el estado correspondiente, comunica qué ocurre y mantiene disponible la acción existente para reintentar o regresar cuando aplique, sin mostrar contenido obsoleto como si fuera actual.
- RF-7:
  - MIENTRAS se presenta el inventario, EL SISTEMA lo identifica de forma visible como inventario de muestra o demostración, compatible con los estados de carga, éxito, vacío y error que correspondan.
  - MIENTRAS se presenta el selector o contenido de métricas del detalle —en carga, éxito, vacío o error—, EL SISTEMA mantiene visible el texto exacto “Simulated data” junto al selector o rango.
  - EL SISTEMA no presenta los registros ni las mediciones como telemetría en vivo o datos persistidos.
- RF-8: CUANDO una persona recorre los controles mediante teclado, EL SISTEMA permite acceder a todas las acciones existentes, mantiene un indicador de foco visible y presenta nombres y relaciones semánticas comprensibles para las partes relevantes de la interfaz, incluidas las gráficas y su alternativa tabular.
- RF-9: MIENTRAS se muestra texto, controles, indicadores de estado o componentes interactivos, EL SISTEMA mantiene contraste conforme a WCAG 2.2 nivel AA y no comunica el estado únicamente mediante color.
- RF-10: MIENTRAS la persona interactúa con controles o percibe cambios de estado o pantalla, EL SISTEMA incluye movimiento sutil y funcional en las partes pertinentes para reforzar la respuesta o la orientación, sin distraer de la lectura; SI la persona ha activado `prefers-reduced-motion`, ENTONCES EL SISTEMA reduce o elimina el movimiento no esencial y conserva la información, respuesta y funcionalidad de la interacción.
- RF-11: CUANDO el dashboard se visualiza en tamaños de pantalla móviles, intermedios o de escritorio, EL SISTEMA adapta la composición sin recortar información o controles necesarios, mantiene utilizables las funciones existentes y evita el desbordamiento horizontal de la página.
- RF-12: CUANDO se evalúa visualmente una pantalla completa, EL SISTEMA mantiene consistencia entre inventario, detalle y estados de carga, vacío, error y nodo inexistente; presenta cada métrica con etiqueta, valor y unidad; y permite localizar y comparar los datos esenciales sin depender únicamente del color, hover o animación.
- RF-13: CUANDO se autoriza iniciar la implementación, EL SISTEMA dispone de una brief o dirección visual que la persona usuaria ha seleccionado y aprobado previamente, con sus atributos definitorios —incluidas paleta, tipografía, composición, superficies y movimiento— y referencias visuales de inventario y detalle; CUANDO se verifica el rediseño, EL SISTEMA coincide con esa referencia aprobada en las pantallas y estados cubiertos, sin alterar las funciones, la veracidad del contenido ni la accesibilidad definida en esta spec.

## Requisitos no funcionales

- La interfaz, sus controles y sus mensajes visibles permanecen en inglés.
- Los textos, indicadores de estado y límites visuales de controles cumplen los contrastes mínimos de WCAG 2.2 nivel AA.
- La identidad visual y la composición funcionan en los navegadores y tamaños de pantalla cubiertos por las verificaciones del proyecto.
- El rediseño conserva un uso legible y estable durante las interacciones existentes; las animaciones no bloquean la navegación ni retrasan la comprensión de los datos.
- La evaluación de la dirección visual concreta ocurre antes de implementar el rediseño; esta spec no fija paleta, tipografías, tokens ni una composición final.

## Casos límite

- Inventario con un único nodo, varios nodos, estados distintos o ninguna coincidencia de búsqueda; deben seguir siendo distinguibles el resultado, el filtro activo y la forma de recuperarse de una lista sin coincidencias.
- Detalle durante carga, error, reintento, vacío excepcional o nodo inexistente; no se deben conservar métricas de un periodo o nodo anterior como si fueran actuales.
- Cambio entre `1h`, `24h` y `7d`; selector, resumen, gráficas y tabla deben seguir representando una única selección.
- Valores de pérdida de paquetes de `0%`, `100%` y fraccionarios; la presentación debe conservar su valor y legibilidad.
- Nombres, direcciones, ubicaciones, marcas de tiempo y valores largos; no deben ocultar estados, controles ni datos necesarios para comprender los nodos.
- Pantallas estrechas, orientación o zoom que reduzcan el espacio disponible; los controles y datos esenciales deben seguir accesibles sin desplazamiento horizontal de página.
- Movimiento reducido activado; todas las acciones y cambios de estado siguen siendo comprensibles sin animación no esencial.
- Uso exclusivo de teclado y navegación por los controles y gráficas; el foco debe permanecer visible y los datos de las gráficas deben conservar una alternativa textual.

## Fuera de alcance

- Añadir alertas, páginas o controles de configuración, búsqueda global, nuevas funciones de monitoreo o capacidades distintas de las existentes.
- Incorporar telemetría real, nuevos nodos o mediciones, uptime, polling, persistencia, autenticación o cambios de API.
- Cambiar la semántica, los valores o los periodos de los datos simulados.
- Eliminar la búsqueda, el filtrado, la navegación, el selector de periodo, los resúmenes, cualquiera de las gráficas, la tabla o los estados existentes.
- Elegir una dirección visual concreta dentro de esta spec; deberá definirse y aprobarse antes de implementar el rediseño.

## Criterios de finalización

- RF-1 y RF-12: la inspección de inventario, detalle y estados confirma una identidad oscura coherente y jerarquía funcional; en el inventario se localizan nombre, estado, identificador, dirección, ubicación y última comprobación, y en el detalle cada métrica presenta etiqueta, valor y unidad. Una comprobación manual confirma que esos datos se entienden sin depender únicamente del color, hover o animación.
- RF-2 a RF-5: las pruebas existentes de inventario, búsqueda, filtros, tarjetas, navegación, selector de periodo, resumen, gráficas y tabla pasan; una revisión manual confirma que la identidad y estado de cada nodo se distinguen y que sus campos clave se localizan directamente.
- RF-6 y RF-7: las pruebas y revisión manual confirman que se conservan los estados existentes, no aparecen datos obsoletos, el inventario se reconoce como muestra y “Simulated data” permanece junto al selector o rango en todos los estados aplicables del detalle, sin afirmaciones de telemetría real o persistencia.
- RF-8 y RF-9: una auditoría automatizada y una comprobación manual por teclado confirman nombres semánticos, foco visible, alternativa textual para las gráficas, contraste mínimo WCAG 2.2 AA (4.5:1 para texto normal, 3:1 para texto grande y componentes visuales relevantes) y estados que no dependen solo del color.
- RF-10: una revisión de las interacciones y transiciones confirma que el rediseño incluye movimiento sutil con respuesta u orientación funcional en las partes pertinentes; al activar `prefers-reduced-motion`, se reduce o elimina el movimiento no esencial y las interacciones conservan su información, respuesta y funcionalidad.
- RF-11: las pruebas responsive y la inspección manual en anchos de 375, 390, 768, 1024 y 1440 píxeles confirman uso sin recorte funcional ni desbordamiento horizontal de página.
- RF-13: antes de la implementación existe una brief/dirección visual explícitamente aprobada por la persona usuaria, con sus atributos definitorios y referencias visuales de inventario y detalle; la revisión compara las pantallas y estados implementados directamente contra esas referencias y confirma coincidencia, sin introducir atributos visuales no aprobados ni capacidades fuera de alcance.
- Las comprobaciones automatizadas pertinentes del proyecto pasan y no se observan errores de interfaz durante los flujos verificados.

## Dudas abiertas

- Ninguna bloqueante para redactar esta spec. Antes de implementar deberá seleccionarse y aprobarse explícitamente la brief/dirección visual y sus referencias; esta spec no inventa los valores concretos de sus atributos.
