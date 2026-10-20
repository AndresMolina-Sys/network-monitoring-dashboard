# MEMORY.md — Dashboard

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- Frontend React/TypeScript desplegado en Vercel; API ASP.NET Core .NET 10 desplegada en Render.
- Dashboard responsive con inventario de nodos, detalle de métricas y selector de periodos `1h`, `24h` y `7d`; el detalle resume latencia reciente, latencia promedio y pérdida máxima del periodo.
- El inventario permite buscar por nombre, ID, dirección o ubicación y filtrar por estado; muestra recuperación cuando no hay coincidencias.
- La API usa tres nodos de prueba en memoria y soporta métricas `1h`, `24h` y `7d`; no hay persistencia ni telemetría en tiempo real.
- El frontend usa la API si existe `VITE_API_BASE_URL`; sin ella, usa fixtures mock. `?demo=empty|error|slow` solo funciona en desarrollo.
- La spec, el plan y las tareas de `specs/001-rangos-de-metricas-simuladas/` están aprobados; T-001 a T-010 completas y periodos verificados en producción con CI/Vercel en verde. Spec 002 de gráfica de pérdida aprobada, T-001 a T-005 completas y aceptación de producción confirmada.
- `specs/004-comparacion-de-nodos/` está aprobada y T-001 a T-017 completas. `/compare` presenta selección, gráficas, leyendas, tabla y estados responsive; sus URLs codifican nodos y periodo. En `/nodes/:nodeId`, el periodo también se codifica en la URL. Ambas vistas normalizan rangos ausentes o inválidos a `1h`, reemplazan el historial al cambiar rango y copian enlaces limpios sin parámetros de demo. Graphify quedó actualizado con 795 nodos/1.125 relaciones sin endpoints huérfanos.
- Spec 005 tiene spec, plan y tareas aprobados; T-001 a T-008 completas. Vitest 205/205, Playwright 34/34, lint, formato y build en verde. Graphify actualizado e inspeccionado: 787 nodos y 1.140 relaciones; diagnóstico sin enlaces huérfanos, endpoints faltantes, bucles ni colapsos.
- Spec 006 — Spec, plan y tareas aprobados; T-001 a T-010 completas: el inventario muestra conteos/KPI simulados, sincroniza filtros, reporta cobertura, reintenta nodos fallidos, descarta flotas obsoletas y presenta un resumen responsive. T-011 a T-016 siguen pendientes.
- Spec, plan y tareas de Spec 003 están aprobados; T-001 a T-030 completas. Se verificaron accesibilidad, responsive, Vitest, build, Storybook y E2E; se corrigieron los avisos priorizados. Graphify se actualizó e inspeccionó; diagnóstico sin enlaces huérfanos, endpoints faltantes, bucles ni colapsos.
- `$sdd` clasifica y enruta a `$feature` o `$sdd-coordinator`; las fases SDD tienen skills separadas y perfiles de proyecto versionados en `.codex/agents/`.
- El coordinador principal conserva preguntas y aprobaciones; un revisor hace QA de solo lectura de cada spec antes de presentarla. La aprobación sigue siendo del usuario.
- `$feature` implementa cambios pequeños solicitados directamente, sin pasos, documento ni aprobación adicional; detiene alcance material nuevo. F-001 a F-004 están completos; F-004 habilita enlaces compartibles por nodo con fallback manual para el portapapeles.
- Impeccable está inicializado en `PRODUCT.md`; las superficies showcase son code-first y el detector está activado. Codex puede requerir aprobación inicial con `/hooks`.

## Decisiones (y por qué)

- Mantener `NetworkMonitoringService` como límite entre UI y datos para poder alternar mock/API y probar componentes con servicios inyectados.
- Mantener “Simulated data” junto al selector, visible sin hover en carga, éxito, vacío y error; no prometer uptime, alertas, autenticación o telemetría en tiempo real.
- Para Spec 003, usar “Applied Research Journal”: jerarquía editorial para escanear nodos y evidencia. “Evidence Margin” es la composición aprobada para `/nodes/:nodeId`: latencia protagonista con pérdida y evidencia lateral; responsive y otros estados se validan en tareas posteriores. La brief oficial enlaza y registra ambos HTML con `related_targets`.
- Mantener `graphify-out` generado y enlazado desde README; actualizarlo al completar una spec o cambios significativos. Versionar solo reporte, HTML y JSON; dejar backups y notas locales fuera del stage. `.graphifyignore` excluye tooling local y outputs, pero Graphify siempre incorpora `graphify-out/memory/` como feedback.
- Crear siempre un commit local al terminar cambios solicitados, con asunto convencional en inglés; hacer push solo cuando el usuario lo pida explícitamente. No añadir líneas `Co-authored-by` ni otra atribución de autor/agente.
- No exponer claves, tokens ni secretos en archivos, logs, comandos, capturas o respuestas.
- Mantener todo el código y contenido de la aplicación en inglés (identificadores, comentarios, pruebas, mensajes de API y textos visibles); la documentación puede seguir el idioma solicitado.
- Usar SDD spec-anchored: `specs/NNN-nombre/{spec.md,plan.md,tasks.md}`; fases con aprobación explícita, una tarea por implementación.
- Para Spec 001, cada apertura inicia en `1h`; ventanas UTC se anclan a la muestra más reciente y la selección vigente prevalece. Datos inválidos producen error; se conservan nodo inexistente, reintentos, vacío excepcional y etiqueta visible en todos los estados.
- Mantener al agente principal como único coordinador de aprobación; pasar a subagentes el alcance y contexto exactos, serializar escrituras y paralelizar solo revisiones independientes de solo lectura. Los perfiles heredan permisos del coordinador; sus instrucciones no son sandbox.
- Al coordinar una solicitud nueva con `$sdd` sin fase explícita, clasificar primero: cambios localizados a `$feature`; cambios amplios o entre capas al flujo SDD. Las invocaciones con fase explícita conservan esa fase. Enlaces compartidos de detalle contienen solo ruta y periodo; los cambios de rango reemplazan historial.
- Versionar solo las skills propias `feature`, `sdd`, `sdd-*`; las skills de terceros, como `frontend-design` y `ui-ux-pro-max`, permanecen locales e ignoradas.
- Mantener honesta la narrativa del portfolio: demo full-stack con datos simulados explícitos, sin implicar telemetría real ni clientes verificados.

## Aprendizajes y errores a evitar

- Las 12 skills propias pasan `quick_validate.py` con un Python que tenga PyYAML y modo UTF-8 habilitado (`-X utf8` puede ser necesario en Windows).
- Las pruebas TypeScript del repo usan Vitest; `node --test` no carga el setup ni la resolución de módulos del proyecto. Ejecutar Vitest con `npm run test -- <ruta>`.
- En Recharts 3, las etiquetas del eje se renderizan en un grupo hermano; las stories deben consultar `.recharts-yAxis-tick-labels`. Para tooltips, enviar `mousemove` a las coordenadas del punto. `ResponsiveContainer` mide cero en Vitest: simular `ResizeObserver` con dimensiones para renderizar SVG e interacciones.
- En este entorno Windows, Vitest puede detenerse con `EPERM` en su caché temporal dentro del sandbox; repetirlo fuera del sandbox. `router.test.tsx` también puede expirar en una suite cargada y pasar aislado; repetir la suite completa antes de atribuir una regresión.
- Playwright puede quedar detenido antes de descubrir tests dentro del sandbox; repetir fuera. Las anulaciones de movimiento reducido deben ir después de reglas interactivas como `:active`, o una transformación posterior las sobrescribe. Limpiar `NO_COLOR` en la configuración evita warnings de Playwright.
- Storybook incluye chunks de runtime, documentación y axe mayores de 500 kB; su umbral de 1,200 kB está limitado a `.storybook/main.ts`. No trasladar esa excepción a la app ni afirmar que optimiza el tamaño del bundle.
- En stories con servicios inyectados, evita pasarlos como `args` serializables: el panel de controles de Storybook puede fallar al imprimirlos; inyectarlos desde el `render`.

## Próximos pasos

- F-004 se publicó en `e610116`; el arreglo de movimiento reducido está verificado localmente y queda sin push hasta solicitud explícita.
