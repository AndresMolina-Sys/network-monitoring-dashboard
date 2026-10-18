# Propuestas de cambios pequeños — Network Monitoring Dashboard

Este documento registra mejoras localizadas antes de implementarlas. No sustituye el flujo SDD: cambios de API, contratos, datos entre capas, persistencia, autenticación, polling o alcance amplio deben pasar por `$sdd`.

Estado general: **Pendiente de aprobación**. No se han autorizado cambios en archivos del producto.

## F-001 — Identificar el inventario como simulado

**Estado:** Pendiente de aprobación  
**Objetivo:** Evitar que la etiqueta actual “Live inventory” sugiera telemetría o actualización en tiempo real, capacidades que el dashboard no tiene.

**Enfoque propuesto:** Cambiar la etiqueta visible a “Simulated inventory”, manteniendo intactos el diseño y el comportamiento del inventario.

**Archivos previstos:**

- `src/App.tsx`: reemplazar el texto “Live inventory”.
- `src/app/router.test.tsx`: comprobar que el dashboard muestra la etiqueta elegida.

**Criterios de aceptación:**

- El encabezado muestra “Simulated inventory”.
- No se presenta el inventario como telemetría en vivo ni se modifica la carga de nodos.
- La prueba del dashboard cubre el texto visible.

**Casos límite:** La etiqueta debe conservar legibilidad en móvil y no cambiar la indicación de datos simulados de la página de métricas.

**Dudas abiertas:** Ninguna bloqueante; el texto propuesto queda sujeto a aprobación.

## F-002 — Mejorar la accesibilidad de las gráficas

**Estado:** Pendiente de aprobación  
**Objetivo:** Hacer que la latencia y la pérdida de paquetes se entiendan sin depender exclusivamente de la lectura visual o del hover.

**Contexto verificado:** Las dos gráficas ya tienen `figure`/`figcaption` y `accessibilityLayer`; el detalle ya ofrece una tabla estructurada con las muestras. La implementación debe conservar y aprovechar esas alternativas, no duplicarlas sin necesidad.

**Enfoque propuesto:** Revisar la salida accesible real de ambas gráficas y completar solo lo que falte: nombres distintos que indiquen nodo, medida, unidad y periodo; acceso por teclado a los puntos y sus valores; y una relación clara con la tabla existente como alternativa textual completa. No declarar conformidad WCAG sin una evaluación suficiente.

**Archivos previstos:**

- `src/features/network-monitoring/components/node-latency-chart.tsx`: corregir nombre, descripción o interacción accesible solo donde la revisión encuentre una brecha.
- `src/features/network-monitoring/components/node-packet-loss-chart.tsx`: aplicar el mismo criterio para pérdida de paquetes y porcentaje.
- `src/features/network-monitoring/pages/network-node-details-page.tsx`: tocar únicamente si hace falta reforzar la relación semántica con la tabla existente.
- `src/features/network-monitoring/pages/network-node-details-page.test.tsx` y `e2e/network-monitoring.spec.ts`: cubrir la alternativa tabular y la navegación por teclado que corresponda.

**Criterios de aceptación:**

- Cada gráfica se identifica de forma única e indica qué métrica representa y sus unidades.
- La información esencial de los puntos no requiere hover; se puede consultar con teclado y mediante la tabla existente.
- Cambiar el periodo mantiene gráfica, etiquetas accesibles y tabla sincronizadas, sin dejar descripciones de otro rango.
- Las pruebas pertinentes pasan y el flujo no introduce desbordamiento horizontal en 390 × 844.

**Casos límite:** Estados de carga, vacío, error y nodo inexistente no deben exponer valores obsoletos; las muestras densas de `7d` deben seguir siendo navegables; no se deben duplicar anuncios o tablas.

**Dudas abiertas:** Ninguna bloqueante. Antes de editar, verificar con tecnología asistiva qué información ya se anuncia para limitar el cambio a brechas observadas.
