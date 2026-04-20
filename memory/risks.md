# Risks

This file mixes repository-wide and project-specific historical risks.

Status tags used below:
- [Active] relevant to the current repository or project state now
- [Latent] environment-dependent or future-facing risk that may matter later
- [Project-specific] applies only to the named project

## IngenIAr migration
- [Active] Existing projects may still need per-project `.ai-dev/` and runtime files if they are actively developed inside IngenIAr.
- [Latent] MCP integrations beyond Context7 still require environment-specific setup.

## 2026-04-01
- [Latent] Engram not installed or not available on PATH could break memory workflows; mitigate with install and version check.
- [Latent] MCP integration not configured could prevent tool access; mitigate with engram setup for OpenCode.

## 2026-04-05
- [Project-specific] Raw Excel data lives outside git (ignored); mitigate by keeping a backup of the source file.

## 2026-04-10 - Proyecto decision-matrix-analyzer [Project-specific]

- Si los proyectos no estan organizados como subcarpetas directas dentro de la ruta raiz, el conteo por proyecto puede no reflejar la estructura real
- Si existen archivos relevantes con nombres no estandarizados que no incluyan ambas palabras, no se contaran en esta primera version
- Los archivos `.xls` se detectan por nombre, pero esta version no abre contenido interno; la extraccion futura puede requerir dependencias adicionales segun el formato real
- Si muchos archivos provienen de una copia o sincronizacion de SharePoint, la fecha de modificacion puede reflejar la operacion de copiado y no necesariamente la fecha de trabajo original del documento
- Si varios archivos de un mismo proyecto tienen exactamente la misma fecha de modificacion, la distincion entre `mas nuevo` y `mas viejo` puede no representar una diferencia temporal real
- El filtro actual por nombre incluye tambien plantillas o archivos ejemplo si contienen `decision` y `matrix`; en la extraccion real aparecieron dos archivos `YYMMDD_decision_matrix_...` que probablemente sean templates
- Algunos archivos `mailformat` no presentan proveedores detectables con la regla actual y quedan reportados solo en consola como `missing_suppliers`
- La logica flexible mejora `_Cost_Deviation`, pero todavia hay 8 archivos sin proveedores detectables; pueden requerir alias o reglas adicionales segun su layout real
- Al ignorar `output/` en git, cualquier resultado generado debe recrearse localmente ejecutando los scripts y no se conserva como artefacto versionado
- `03_load_postgres.py` depende de credenciales locales correctas en `.env`; si `PGUSER` o `PGPASSWORD` no coinciden con el PostgreSQL instalado, la carga fallara por autenticacion
- La tabla `03_FORECAST_EXTRACT_DECISION_MATRIX` se crea completamente en `text` para asegurar la carga completa del CSV; si se requieren tipos numericos, habra que crear una vista o tabla derivada tipada

## 2026-04-13 - Proyecto VEGA_ERP [Project-specific]

- La Fase 1 valida compilacion y migraciones, pero todavia no tiene pruebas end-to-end automatizadas del flujo real de login en navegador
- `next-auth@beta` puede seguir emitiendo warnings de runtime Edge segun la cadena `jose`; hoy no bloquea el build, pero conviene vigilarlo en futuras fases
- Los modulos de negocio fuera de auth/layout quedaron solo scaffolded; las rutas existen, pero no implementan CRUD ni reglas funcionales todavia
- El flujo RFQ usa una plantilla Excel simplificada y no persiste binarios reales en storage; `response_file_url` guarda una referencia logica al archivo importado
- Las pantallas finales no tienen tests automatizados end-to-end de aprobacion, awarding RFQ ni change control; hoy estan validadas por build y reglas servidoras
- El usuario `postgres` del contenedor se desalineo una vez con `.env`; si vuelve a cambiar fuera del repo, Prisma fallara otra vez por autenticacion hasta sincronizar credenciales
- Aunque ahora hay fallback visual de carga, si la BD cae en runtime el usuario seguira viendo pantallas de error informativas; aun no existe reintento automatico ni observabilidad centralizada
