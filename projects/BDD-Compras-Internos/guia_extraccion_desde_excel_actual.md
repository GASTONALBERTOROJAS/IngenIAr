# Guia De Extraccion Desde El Excel Actual

## Objetivo

Pasar la informacion de `Turmübersicht NX EUR` a la plantilla `BDD-Compras-Internos_sql_template.xlsx` sin arrastrar la estructura ancha del archivo original.

La regla principal es:

- `Key` identifica de forma unica cada registro.
- `A:K` se cargan como maestro.
- `L:CW` se convierten a formato largo en `component_offer`.
- `DV:DX` se cargan en `benchmark_sc`.
- `DR` se usa en `logistics_adjustments`.
- `DO:ED` pueden copiarse a `report_output` si queres conservar el resultado actual del Excel.
- `CX:DN` y `EF:GF` no son fuente maestra; son columnas derivadas.

## Orden Recomendado

1. Cargar `tower_master`.
2. Construir un diccionario de metadatos por columna de oferta usando filas `2:7`.
3. Cargar `component_offer` desde `L:CW`.
4. Cargar `benchmark_sc` desde `DV:DX`.
5. Cargar `logistics_adjustments` desde `DR`.
6. Si queres preservar el reporte actual, cargar `report_output` desde `DO:ED`.

## 1. Cargar `tower_master`

Tomar una fila por cada `Key` desde la hoja `Turmübersicht NX EUR`.

Mapeo directo:

- `A Key` -> `tower_master.key`
- `B Name` -> `tower_master.name`
- `C Nacelle` -> `tower_master.nacelle`
- `D Tower` -> `tower_master.tower_code`
- `E Height` -> `tower_master.height_m`
- `F Trafo` -> `tower_master.trafo`
- `G Platform` -> `tower_master.platform`
- `H Frequency` -> `tower_master.frequency`
- `I Climate / Version` -> `tower_master.climate_version`
- `J Sections` -> `tower_master.sections`
- `K Tower Drawing No.` -> `tower_master.tower_drawing_no`
- `status` -> cargar como `active` por defecto
- `notes` -> usar solo si hay observaciones manuales
- `last_update` -> opcional, si despues queres controlar version de carga

Reglas:

- usar el valor visible, no la formula
- no derivar nada desde `Name` en la nueva plantilla
- si falta `Height`, `Sections` o `Tower Drawing No.`, dejar vacio y marcarlo para limpieza posterior

## 2. Construir El Diccionario De Columnas De Oferta

Antes de cargar `component_offer`, hay que leer las filas de encabezado `2:7` para cada columna `L:CW`.

Para cada columna crear una ficha con:

- `source_column`: letra de columna, por ejemplo `AE`
- `row2_group`: categoria o commodity
- `row3_platform`: plataforma o moneda segun bloque
- `row4_incoterm`: FCA, DAP, EXW, etc.
- `row5_comment`: comentario funcional
- `row6_context`: planta, fecha, mercado o nota
- `row7_supplier_raw`: nombre del proveedor u opcion visible en la tabla

Esta parte es clave porque en el Excel actual gran parte de la logica esta en el encabezado, no en las filas.

## 3. Cargar `component_offer`

Por cada fila de torre y por cada columna `L:CW` con dato util, crear un registro en `component_offer`.

### Mapeo General

- `tower_key` -> columna `A`
- `component_category` -> desde `row2_group`
- `component_subcategory` -> usar cuando haga falta distinguir opciones dentro de una misma categoria
- `supplier` -> parsear desde `row7_supplier_raw`
- `supplier_option` -> usar para variantes como `RC2`, `RC4`, `EN81-44`, `DE/DK/PL`, etc.
- `incoterm` -> desde `row4_incoterm`
- `platform_scope` -> desde `row3_platform` si aplica
- `market_scope` -> parsear desde `row7_supplier_raw` o `row6_context`
- `plant_location` -> usar `row6_context` si contiene ubicacion tipo `Stettin [PL]`, `Vicarli [ES]`
- `origin_country` -> opcional, solo si lo queres normalizar despues
- `currency` -> extraer del encabezado del bloque
- `effective_date` -> usar si `row6_context` tiene fecha
- `price_value` -> valor de la celda
- `price_uom` -> normalmente moneda o unidad del bloque
- `price_status` -> normalizar segun reglas de abajo
- `comment` -> desde `row5_comment` o notas utiles del bloque
- `source_sheet` -> `Turmübersicht NX EUR`
- `source_column` -> por ejemplo `AE`

### Regla De Estados

Normalizar asi:

- numero valido -> `price_status = valid`
- celda vacia -> no crear registro, salvo que quieras registrar ausencia explicita
- `N/A` o `#N/A` -> `price_status = not_available`
- `On Dem.` o `on request` -> `price_status = on_demand`
- `#REF!`, `#VALUE!`, `#DIV/0!` -> `price_status = error`

En esos casos:

- `price_value` queda vacio
- el texto original puede ir a `comment`

## 4. Bloques De Columnas A Convertir En `component_offer`

### Acero y flanges

- `L:N` -> `Steel Plate`
- `O:Q` -> `Flanges`

### Door frame

- `R:AC` -> `Door Frame`

### Cables

- `AD` -> `Power Cables`
- `AE:AK` -> `MV Cable`
- `AL:AO` -> `LV Cable`
- `AP` -> `Network Cable`
- `AQ` -> ignorar, es placeholder (`Spalte1`)

### Tower lighting

- `AR:AX` -> `Tower Lighting`

### Cable clamps

- `AY:AZ` -> `Cable Clamps`

### Service lift

- `BA:BC` -> `Service Lift`

### Ladder y accesorios

- `BD:BG` -> dividir en:
  - `Ladder`
  - `Fall Arrest`
  - `Resting Platform`
  si queres mas detalle en `component_subcategory`

### Ventilation y converter cooler

- `BH` -> `Ventilation System`
- `BI` -> `Converter Cooler`

### Tower door options

- `BJ:BU` -> `Tower Door`
- conviene usar `component_subcategory` para guardar la opcion exacta:
  - `A1 / RC2 Opt.3 / Single-Zylinderschloss`
  - `A2 / RC4 Opt.3 / Single-Zylinderschloss`
  - etc.

### Tarpaulin

- `BV:BX` -> `Tarpaulin`

### Mechanical internals

- `BY:CI` -> `Mechanical Internals`
- usar `market_scope` para diferenciar EU, TUR, Asia
- usar `supplier` para Eiffage, Metalpedro, Welcon, KGW, ABP, SAY, JSM, Sunnylion

### Small items

- `CJ:CL` -> `Small Items`

### Damper

- `CM:CO` -> `Damper`

### Tower bolts

- `CP:CW` -> `Tower Bolts`

## 5. Que NO Cargar En `component_offer`

No cargar como fuente base:

- `CX:DN` porque son columnas seleccionadas o derivadas
- `DO:ED` porque son totales y benchmark
- `EF:GF` porque son porcentajes derivados

## 6. Cargar `benchmark_sc`

Crear 3 filas por cada `Key`:

- `DV SC EU` -> `scenario = EU`
- `DW SC TUR` -> `scenario = TUR`
- `DX SC Asia` -> `scenario = Asia`

Mapeo:

- `tower_key` -> `A`
- `benchmark_value` -> `DV`, `DW`, `DX`
- `currency` -> normalmente `EUR`, salvo que definas otra cosa de negocio
- `source_version` -> `SCv24.2`

## 7. Cargar `logistics_adjustments`

Usar `DR LOG / (only tower manufacturer)`.

Como el template tiene escenario, repetir 3 filas por `Key` si queres mantener compatibilidad con el reporte:

- `EU`
- `TUR`
- `Asia`

Mapeo:

- `tower_key` -> `A`
- `scenario` -> `EU`, `TUR`, `Asia`
- `adjustment_type` -> `LOG`
- `value` -> `DR`
- `comment` -> `only tower manufacturer`

## 8. Cargar `report_output`

Esto es opcional. Solo sirve si queres conservar el resultado actual del Excel mientras migras.

Crear 3 filas por `Key`:

### Escenario EU

- `tower_key` -> `A`
- `scenario` -> `EU`
- `total_material` -> `DO`
- `logistics` -> `DR`
- `total_cost` -> `DS`
- `benchmark_sc` -> `DV`
- `delta_vs_sc` -> `DY`
- `delta_vs_sc_pct` -> `EB`

### Escenario TUR

- `tower_key` -> `A`
- `scenario` -> `TUR`
- `total_material` -> `DP`
- `logistics` -> `DR`
- `total_cost` -> `DT`
- `benchmark_sc` -> `DW`
- `delta_vs_sc` -> `DZ`
- `delta_vs_sc_pct` -> `EC`

### Escenario Asia

- `tower_key` -> `A`
- `scenario` -> `Asia`
- `total_material` -> `DQ`
- `logistics` -> `DR`
- `total_cost` -> `DU`
- `benchmark_sc` -> `DX`
- `delta_vs_sc` -> `EA`
- `delta_vs_sc_pct` -> `ED`

## 9. Columnas Derivadas Que Deben Quedarse Fuera De La BDD Base

No usarlas como fuente primaria:

- `CX:DN` valores seleccionados por regla
- `DO:DU` totales material y totales finales
- `DV:DX` benchmark, salvo en su hoja especifica
- `DY:ED` deltas
- `EF:GF` porcentajes de participacion

La base SQL deberia recalcular esto con vistas o queries.

## 10. Regla Practica Para Hacer La Migracion

### Primera pasada

- cargar solo `tower_master`
- cargar solo `component_offer`

### Segunda pasada

- cargar `benchmark_sc`
- cargar `logistics_adjustments`

### Tercera pasada

- reconstruir `report_output`

## 11. Resumen Corto

- `A:K` -> `tower_master`
- `L:CW` -> `component_offer`
- `DV:DX` -> `benchmark_sc`
- `DR` -> `logistics_adjustments`
- `DO:ED` -> `report_output` opcional
- `CX:DN` y `EF:GF` -> no usar como fuente maestra
