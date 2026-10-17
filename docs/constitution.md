# Constitución del proyecto

Estos principios guían cada especificación y cambio del Network Monitoring Dashboard. Son verificables y solo se modifican mediante una solicitud explícita.

1. **Alcance aprobado:** implementa únicamente requisitos que el usuario haya aprobado. Si cambia el alcance, actualiza primero la especificación y vuelve a someter a aprobación el plan y las tareas afectadas.
2. **Límites de arquitectura:** conserva las responsabilidades separadas entre interfaz React, contratos de dominio, `NetworkMonitoringService` y API ASP.NET Core. Coordina los cambios de contrato entre las capas y sus pruebas.
3. **Capacidades honestas:** identifica los nodos y mediciones actuales como datos de prueba en memoria; no afirmes que hay telemetría en vivo, persistencia, cálculo de uptime, alertas o autenticación si no se han implementado y verificado.
4. **Verificación proporcional:** cada requisito funcional debe tener un criterio comprobable y evidencia de validación. Usa Vitest para frontend, xUnit para API y Playwright para navegación y comportamiento responsive; usa las pruebas full-stack cuando el cambio cruce ambas capas.
5. **Seguridad por defecto:** no expongas ni registres secretos; conserva CORS explícito y nunca uses `*` como solución de acceso.
6. **Idioma y comunicación:** escribe código, identificadores, comentarios, pruebas, mensajes de API y textos de la aplicación en inglés. Escribe documentación en el idioma solicitado; para este flujo SDD, usa español.
