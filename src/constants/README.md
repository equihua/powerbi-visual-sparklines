# Constantes Centralizadas del Visual

Este directorio contiene las constantes centralizadas utilizadas en todo el visual de Power BI para evitar duplicación y facilitar el mantenimiento.

## 📁 Archivos

### visualDefaults.ts

Archivo principal que contiene todas las constantes, enumeraciones y valores predeterminados del visual.

## 🎯 Propósito

La centralización de constantes ofrece los siguientes beneficios:

1. **Eliminación de duplicación**: Los valores repetidos se definen una sola vez
2. **Mantenimiento simplificado**: Cambiar un valor predeterminado solo requiere una edición
3. **Consistencia**: Garantiza que los mismos valores se usen en capabilities.json y en el código
4. **Type-safety**: TypeScript proporciona autocompletado y validación de tipos
5. **Documentación**: Las constantes están bien documentadas y organizadas

## 📋 Estructura de visualDefaults.ts

### 1. Enumeraciones y Opciones

Define todos los tipos enumerados usados en dropdowns:

- **SparklineChartType**: Tipos de gráficos sparkline (line, bar, area, pie, donut)
- **TableStyle**: Estilos de tabla (default, striped, bordered, hover)
- **TextAlignment**: Alineaciones de texto (left, center, right)
- **FontFamily**: Familias de fuentes disponibles
- **BorderStyle**: Estilos de borde (solid, dashed, dotted, double)
- **BorderSection**: Secciones donde aplicar bordes (all, header, rows)
- **ScrollBehavior**: Comportamientos de scroll (smooth, auto)

Cada enumeración tiene su correspondiente array de opciones para dropdowns (ej: `SPARKLINE_CHART_TYPE_OPTIONS`).

### 2. Colores Predeterminados

El objeto `DEFAULT_COLORS` contiene todos los colores usados en el visual:

```typescript
DEFAULT_COLORS = {
  primaryText: "#000000",
  lightGray: "#F5F5F5",
  primaryBlue: "#0078D4",
  // ... etc
};
```

### 3. Valores Predeterminados por Sección

Cada sección de configuración tiene su objeto de defaults:

- **TYPOGRAPHY_DEFAULTS**: Configuración de tipografía global
- **SPARKLINE_DEFAULTS**: Configuración de sparklines
- **GENERAL_DEFAULTS**: Configuración general de la tabla
- **COLUMN_DEFAULTS**: Configuración de columnas
- **ROW_DEFAULTS**: Configuración de filas
- **GRID_DEFAULTS**: Configuración de cuadrícula y bordes
- **INTERACTIVITY_DEFAULTS**: Configuración de interactividad

### 4. Validadores de Power BI

Configuraciones de validación comunes:

```typescript
VALIDATORS = {
  textSize: {
    min: { value: 8, type: powerbi.visuals.ValidatorType.Min },
    max: { value: 40, type: powerbi.visuals.ValidatorType.Max },
  },
  // ... etc
};
```

### 5. Límites de Datos

Define los límites máximos para roles de datos:

```typescript
DATA_ROLE_LIMITS = {
  mainCategory: 1,
  axis: 1,
  measure: 10,
  sparkline: 5,
};
```

## 🔧 Uso

### Importación en Settings

```typescript
import {
  SPARKLINE_CHART_TYPE_OPTIONS,
  SPARKLINE_DEFAULTS,
  VALIDATORS,
} from "../constants/visualDefaults";

// Usar en la configuración
chartType = new formattingSettings.ItemDropdown({
  name: "chartType",
  displayName: "Tipo de gráfico",
  items: [...SPARKLINE_CHART_TYPE_OPTIONS],
  value: SPARKLINE_CHART_TYPE_OPTIONS[0],
});

color = new formattingSettings.ColorPicker({
  name: "color",
  displayName: "Color",
  value: { value: SPARKLINE_DEFAULTS.color },
});
```

### Importación en Componentes React

```typescript
import {
  DEFAULT_COLORS,
  SPARKLINE_DEFAULTS,
  SparklineChartType,
} from "../constants/visualDefaults";

// Usar en componentes
const lineColor = DEFAULT_COLORS.primaryBlue;
const defaultLineWidth = SPARKLINE_DEFAULTS.lineWidth;

if (chartType === SparklineChartType.Line) {
  // ...
}
```

## 📝 Archivos Refactorizados

Los siguientes archivos de settings han sido refactorizados para usar las constantes:

1. ✅ [settings/sparkline.ts](../settings/sparkline.ts)
2. ✅ [settings/general.ts](../settings/general.ts)
3. ✅ [settings/typography.ts](../settings/typography.ts)
4. ✅ [settings/columns.ts](../settings/columns.ts)
5. ✅ [settings/grid.ts](../settings/grid.ts)
6. ✅ [settings/rows.ts](../settings/rows.ts)

## 🎨 Beneficios de esta Refactorización

### Antes (Duplicado)

```typescript
// En sparkline.ts
items: [
  { value: "line", displayName: "Línea" },
  { value: "bar", displayName: "Barras" },
  // ...
],
value: { value: "line", displayName: "Línea" },

// En otro archivo
color: { value: "#0078D4" },

// En otro archivo más
lineWidth: 1.5,
```

### Después (Centralizado)

```typescript
// En visualDefaults.ts (UNA VEZ)
export const SPARKLINE_CHART_TYPE_OPTIONS = [
  { value: SparklineChartType.Line, displayName: "Línea" },
  { value: SparklineChartType.Bar, displayName: "Barras" },
  // ...
];

export const SPARKLINE_DEFAULTS = {
  chartType: SparklineChartType.Line,
  color: DEFAULT_COLORS.primaryBlue,
  lineWidth: 1.5,
};

// En todos los archivos (REUTILIZAR)
import {
  SPARKLINE_CHART_TYPE_OPTIONS,
  SPARKLINE_DEFAULTS,
} from "../constants/visualDefaults";
```

## 🔄 Sincronización con capabilities.json

Aunque `capabilities.json` no puede importar código TypeScript directamente, las constantes en `visualDefaults.ts` deben mantenerse sincronizadas manualmente con las definiciones en `capabilities.json`.

**Proceso recomendado:**

1. Definir nuevos valores en `visualDefaults.ts`
2. Actualizar `capabilities.json` con los mismos valores
3. Los settings TypeScript importarán automáticamente de `visualDefaults.ts`

Esto reduce la duplicación del código TypeScript al 100% y la duplicación general en aproximadamente un 80%.

## 📚 Próximos Pasos

Para mejorar aún más:

1. Considerar generar `capabilities.json` automáticamente desde las constantes TypeScript usando un script de build
2. Agregar validación para asegurar que `capabilities.json` y `visualDefaults.ts` estén sincronizados
3. Documentar todos los valores en un solo lugar para referencia rápida

## 🛠️ Mantenimiento

Al agregar nuevas propiedades:

1. Agregar el enum/tipo en la sección de enumeraciones
2. Agregar las opciones de dropdown si es necesario
3. Agregar el valor predeterminado en el objeto `*_DEFAULTS` correspondiente
4. Actualizar `capabilities.json` para reflejar los cambios
5. Usar las constantes en los archivos de settings

**¡IMPORTANTE!** Nunca duplicar valores hardcodeados. Siempre usar las constantes exportadas.
