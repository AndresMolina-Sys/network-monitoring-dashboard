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
- `specs/004-comparacion-de-nodos/spec.md` está creada y pasó QA independiente; permanece pendiente de aprobación. Define comparación de latencia y pérdida entre 2–3 nodos, con ventanas de igual duración ancladas por nodo y alineación gráfica por tiempo transcurrido.
- Spec, plan y tareas de Spec 003 están aprobados; T-001 a T-030 completas. Se verificaron accesibilidad, responsive, Vitest, build, Storybook y E2E; se corrigieron los avisos priorizados. Graphify se actualizó e inspeccionó; diagnóstico sin enlaces huérfanos, endpoints faltantes, bucles ni colapsos.
- `$sdd` clasifica y enruta a `$feature` o `$sdd-coordinator`; las fases SDD tienen skills separadas y perfiles de proyecto versionados en `.codex/agents/`.
- El coordinador principal conserva preguntas y aprobaciones; un revisor hace QA de solo lectura de cada spec antes de presentarla. La aprobación sigue siendo del usuario.
- `$feature` implementa cambios pequeños solicitados directamente, sin pasos, documento ni aprobación adicional; detiene alcance material nuevo. F-001, F-002 y F-003 están completos.
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
- Al coordinar una solicitud nueva con `$sdd` sin fase explícita, clasificar primero: cambios localizados a `$feature`; cambios amplios o entre capas al flujo SDD. Las invocaciones con fase explícita conservan esa fase.
- Versionar solo las skills propias `feature`, `sdd`, `sdd-*`; las skills de terceros, como `frontend-design` y `ui-ux-pro-max`, permanecen locales e ignoradas.
- Mantener honesta la narrativa del portfolio: demo full-stack con datos simulados explícitos, sin implicar telemetría real ni clientes verificados.

## Aprendizajes y errores a evitar

- Las 12 skills propias pasan `quick_validate.py` con un Python que tenga PyYAML y modo UTF-8 habilitado (`-X utf8` puede ser necesario en Windows).
- Las pruebas TypeScript del repo usan Vitest; `node --test` no carga el setup ni la resolución de módulos del proyecto. Ejecutar Vitest con `npm run test -- <ruta>`.
- En Recharts 3, las etiquetas del eje se renderizan en un grupo hermano; las stories deben consultar `.recharts-yAxis-tick-labels`. Para probar tooltips, enviar `mousemove` a las coordenadas del punto y esperar el valor renderizado.
- En este entorno Windows, Vitest puede detenerse antes de ejecutar pruebas por `EPERM` al renombrar su caché temporal; con autorización, repetir la prueba dirigida fuera del sandbox.
- Playwright puede quedar detenido antes de descubrir tests dentro del sandbox; la ejecución autorizada fuera del sandbox pasó desktop y móvil. Playwright fuerza `FORCE_COLOR` en sus workers; limpiar `NO_COLOR` al cargar la configuración evita el warning cuando el shell lo hereda.
- Storybook incluye chunks de runtime, documentación y axe mayores de 500 kB; su umbral de 1,200 kB está limitado a `.storybook/main.ts`. No trasladar esa excepción a la app ni afirmar que optimiza el tamaño del bundle.
- En stories con servicios inyectados, evita pasarlos como `args` serializables: el panel de controles de Storybook puede fallar al imprimirlos; inyectarlos desde el `render`.

## Próximos pasos

- Sin pendientes de los tres avisos priorizados.
