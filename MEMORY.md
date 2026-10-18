# MEMORY.md — Dashboard

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- Frontend React/TypeScript desplegado en Vercel; API ASP.NET Core .NET 10 desplegada en Render.
- Dashboard responsive con inventario de nodos, detalle de métricas y selector de periodos `1h`, `24h` y `7d`; el detalle resume latencia reciente, latencia promedio y pérdida máxima del periodo.
- El inventario permite buscar por nombre, ID, dirección o ubicación y filtrar por estado; muestra recuperación cuando no hay coincidencias.
- La API usa tres nodos de prueba en memoria y soporta métricas `1h`, `24h` y `7d`; no hay persistencia ni telemetría en tiempo real.
- El frontend usa la API si existe `VITE_API_BASE_URL`; sin ella, usa fixtures mock. `?demo=empty|error|slow` solo funciona en desarrollo.
- La spec, el plan y las tareas de `specs/001-rangos-de-metricas-simuladas/` están aprobados; T-001 a T-010 están completas.
- `specs/002-grafica-perdida-de-paquetes/` está aprobada y T-001 a T-005 completas; aceptación de producción confirmada por el usuario. T-010 de Spec 001 verificó los tres periodos y CI/Vercel quedaron en verde.
- Spec, plan y checklist de Spec 003 están aprobados; T-001 a T-011 completas. T-005/T-007 se revisaron localmente al no devolver informe los revisores; T-006 confirmó code-led sin phase gates. T-007 fijó base carbón/papel/cobre; T-008 creó el roster; T-009 refinó filtros/estados; T-010 el resumen del nodo; T-011 los controles de métricas. El format:check global marca 49 archivos Impeccable no versionados; los cambios del producto pasan Prettier.
- Graphify refrescado tras `12b7913`: 595 nodos, 815 enlaces y 94 comunidades con nombre; el diagnóstico no detectó enlaces huérfanos, endpoints faltantes ni colapsos.
- `$sdd` clasifica y enruta a `$feature` o `$sdd-coordinator`; las fases SDD tienen skills separadas y perfiles de proyecto versionados en `.codex/agents/`.
- El coordinador principal conserva preguntas y aprobaciones; un revisor hace QA de solo lectura de cada spec antes de presentarla. La aprobación sigue siendo del usuario.
- `$feature` implementa cambios pequeños directamente, sin lista de pasos, `feature.md` ni aprobación adicional; F-001, F-002 y F-003 están completos.
- Impeccable está inicializado en `PRODUCT.md`; las superficies showcase son code-first y el detector está activado. Codex puede requerir aprobación inicial con `/hooks`.

## Decisiones (y por qué)

- Mantener `NetworkMonitoringService` como límite entre UI y datos para poder alternar mock/API y probar componentes con servicios inyectados.
- Mantener “Simulated data” junto al selector, visible sin hover en carga, éxito, vacío y error; no prometer uptime, alertas, autenticación o telemetría en tiempo real.
- Para Spec 003, usar “Applied Research Journal”: jerarquía editorial para escanear nodos y evidencia. “Evidence Margin” es la composición aprobada para `/nodes/:nodeId`: latencia protagonista con pérdida y evidencia lateral; responsive y otros estados se validan en tareas posteriores. La brief oficial enlaza y registra ambos HTML con `related_targets`.
- Mantener `graphify-out` generado y enlazado desde README; actualizarlo al completar una spec o cambios significativos. Versionar solo reporte, HTML y JSON; dejar backups y notas locales fuera del stage.
- Crear siempre un commit local al terminar cambios solicitados, con asunto convencional en inglés; hacer push solo cuando el usuario lo pida explícitamente. No añadir líneas `Co-authored-by` ni otra atribución de autor/agente.
- No exponer claves, tokens ni secretos en archivos, logs, comandos, capturas o respuestas.
- Mantener todo el código y contenido de la aplicación en inglés (identificadores, comentarios, pruebas, mensajes de API y textos visibles); la documentación puede seguir el idioma solicitado.
- Usar SDD spec-anchored: `specs/NNN-nombre/{spec.md,plan.md,tasks.md}`; fases con aprobación explícita, una tarea por implementación.
- Para Spec 001, cada apertura inicia en `1h`; las ventanas UTC se anclan a la muestra más reciente. Datos simulados cubren los tres rangos y la etiqueta permanece visible en todos los estados.
- La selección más reciente prevalece; datos inválidos producen error sin cambiar el rango. Se conservan nodo inexistente, reintentos y vacío excepcional.
- Mantener al agente principal como único coordinador de aprobación; pasar a subagentes el alcance y contexto exactos, serializar escrituras y paralelizar solo revisiones independientes de solo lectura. Los perfiles heredan permisos del coordinador; sus instrucciones no son sandbox.
- Para cambios pequeños solicitados, `$feature` implementa directamente sin lista de pasos ni documento adicional; detenerse ante decisiones materiales nuevas o límites de alcance.
- Al coordinar una solicitud nueva con `$sdd` sin fase explícita, clasificar primero: cambios localizados a `$feature`; cambios amplios o entre capas al flujo SDD. Las invocaciones con fase explícita conservan esa fase.
- Versionar solo las skills propias `feature`, `sdd`, `sdd-*`; las skills de terceros, como `frontend-design` y `ui-ux-pro-max`, permanecen locales e ignoradas.
- Mantener honesta la narrativa del portfolio: demo full-stack con datos simulados explícitos, sin implicar telemetría real ni clientes verificados.

## Aprendizajes y errores a evitar

- Las 12 skills propias pasan `quick_validate.py` con un Python que tenga PyYAML y modo UTF-8 habilitado (`-X utf8` puede ser necesario en Windows).
- Las pruebas TypeScript del repo usan Vitest; `node --test` no carga el setup ni la resolución de módulos del proyecto. Ejecutar Vitest con `npm run test -- <ruta>`.
- En Recharts 3, las etiquetas del eje se renderizan en un grupo hermano; las stories deben consultar `.recharts-yAxis-tick-labels`. Para probar tooltips, enviar `mousemove` a las coordenadas del punto y esperar el valor renderizado.
- En este entorno Windows, Vitest puede detenerse antes de ejecutar pruebas por `EPERM` al renombrar su caché temporal; con autorización, repetir la prueba dirigida fuera del sandbox.
- Playwright puede quedar detenido antes de descubrir tests dentro del sandbox; la ejecución autorizada fuera del sandbox pasó desktop y móvil.
- `npm run build-storybook` termina correctamente con una advertencia de chunks generados mayores de 500 kB; registrar la advertencia, no tratarla como fallo.

## Próximos pasos

- Spec 003: T-001 a T-011 completas; siguiente es T-012, rediseñar la gráfica de latencia. Las capturas DevTools quedan para T-025; el conector informó que el perfil Chrome ya está en uso.
