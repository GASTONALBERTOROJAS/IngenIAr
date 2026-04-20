# Decisions

This file mixes repository-wide and project-specific historical decisions.

Status tags used below:
- [Implemented] reflected in the current repository or project state
- [Policy] adopted as an expected operating rule, even when enforcement is procedural rather than fully automated
- [Project-specific] applies only to the named project

## IngenIAr migration
- [Implemented] Adopt this repo as the base for IngenIAr instead of starting from scratch.
- [Implemented] Add Claude runtime support, `.ai-dev/`, QA gate and canonical core.

## 2026-04-01
- [Policy] Adopt Engram as external memory system via MCP tools (mem_save, mem_search, mem_session_summary).
- [Policy] Keep project memory as versioned Markdown in memory/ and keep session memory local in memory/session/.
- [Implemented] Require all new projects to live under projects/.
- [Policy] Add readiness checks (test command prompt, gh auth check) and a minimal PR template.
- [Policy] Add a minimal smoke test scenario and branch naming convention.

## 2026-04-05 [Project-specific]
- Forecast_Nordex will use local Docker Compose for PostgreSQL and DBeaver for inspection.
- Forecast_Nordex will use a project-local Python venv and requirements.txt for dependencies.
- Forecast_Nordex scripts use numeric prefixes to indicate execution order.
## 2026-04-10 - Proyecto decision-matrix-analyzer [Project-specific]

- Se implementa una estructura minimalista con `scripts/`, `output/`, `config.json` y `README.md`
- La ruta de datos queda fuera del proyecto y se configura en `config.json` para facilitar portabilidad entre equipos y rutas de SharePoint
- Cada subcarpeta directa dentro de la ruta raiz se considera un proyecto
- Un archivo valido debe ser Excel y contener las palabras `decision` y `matrix` en el nombre, sin importar orden ni mayusculas
- La fecha usada para determinar el archivo mas nuevo de cada proyecto es la fecha de modificacion del archivo en el sistema
- La consola se fuerza a UTF-8 con reemplazo para evitar errores al imprimir nombres con caracteres internacionales en Windows
- La salida detallada en consola se limita a proyectos con mas de una decision matrix; para cada uno se muestra solo el archivo mas nuevo y el mas viejo, en ese orden
- La extraccion de datos se implementa en un script separado `scripts/extract_mailformat_data.py` y consolida resultados en un Excel con hojas `matrices`, `suppliers` y `errors`
- Para rendimiento, la lectura de archivos Excel se hace con `python-calamine` y la escritura del fichero final con `openpyxl`
- La salida final del extractor se simplifica a una sola hoja `mailformat_data` con una fila por proveedor, repitiendo datos del proyecto y manteniendo `project_folder`
- Si `mailformat_extract.xlsx` esta bloqueado por Excel, el script guarda automaticamente un fichero alternativo con timestamp en lugar de fallar
- La demo flexible busca etiquetas por significado y alias, detectando su columna real en la hoja, en lugar de asumir coordenadas fijas `B:C`
- En la demo, solo los labels del bloque `Award` se buscan en un rango amplio; el resto de campos se limita a `A:B` para no confundirlos con etiquetas internas del bloque `Award`
- La demo se elimina del flujo final y el proyecto se deja con dos scripts oficiales numerados: `01_scan_decision_matrices.py` y `02_extract_mailformat.py`
- `output/` se deja vacia y totalmente ignorada por git; se considera una carpeta de resultados generados, no parte estable del repositorio
- Se elimina Docker del proyecto `decision-matrix-analyzer` y se adopta carga directa a PostgreSQL local mediante `03_load_postgres.py`
- La tabla final de PostgreSQL se llama `03_FORECAST_EXTRACT_DECISION_MATRIX` y se carga en la base `FORECAST_NDX`
- La carga local usa `.env`/`.env.example` con variables `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE_ADMIN` y `PGDATABASE_TARGET`

## 2026-04-13 - Proyecto VEGA_ERP [Project-specific]

- VEGA_ERP se crea obligatoriamente dentro de `projects/VEGA_ERP`
- El alta de usuarios no sera publica; solo habra login y bootstrap inicial mediante seed admin
- En desarrollo, VEGA_ERP usara PostgreSQL 16 en Docker y la app Next.js correra localmente fuera de contenedor
- Se alinea el scaffold a `Next.js 14 + React 18` para seguir el documento funcional en lugar de mantener la plantilla mas nueva generada por `create-next-app`
- Prisma se fija en la linea 6.x para mantener el schema clasico con `datasource url` y evitar la configuracion nueva obligatoria de Prisma 7
- La Fase 5 consume bolsa de contratos de bridas mediante `tons_assigned` y el `sharewallet_used` de internos se calcula por cantidad de torres asignadas
- La edicion de proyectos y grupos queda restringida a `admin`, mientras el resto de roles conserva lectura
- El Sourcing Board aprueba solo cuando no quedan tareas abiertas; `conditionally_approved` genera tareas por menciones `@usuario`
- La capa final de reporting se concentra en `/reports`, combinando finanzas, control de cambios y audit trail en una sola vista
- El hardening UX prioriza fallbacks de carga en server pages y avisos operativos visibles antes que abrir nuevas pantallas o agregar complejidad extra
