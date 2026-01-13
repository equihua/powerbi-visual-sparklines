# Refactorización de Tipografía - Power BI Sparklines Visual

## Resumen Ejecutivo

Se ha completado una refactorización completa del sistema de tipografía del visual para adoptar la API moderna de FormattingSettings con **FontControl** como control unificado. Esto mejora significativamente la escalabilidad, mantenibilidad y coherencia del panel de Formato.

### Cambios Principales

1. **Modernización de capabilities.json**: Se reemplazó enumeration de fontFamily por `formatting.fontFamily` compatible con FontControl
2. **Implementación de TypographyCard**: Nueva tarjeta dedicada con FontControl que agrupa familia, tamaño y propiedades B/I/U
3. **Reorganización de GeneralCompositeCard**: Se movió tipografía a tarjeta separada, simplificando la estructura
4. **Nuevo método helper getTypographyStyle()**: Punto único de acceso para leer estilos tipográficos
5. **Integración en VisualFormattingSettingsModel**: Typography es ahora una tarjeta de primer nivel

---

## Archivo por Archivo

### 1. **capabilities.json**

#### Cambios Realizados:

**Antes:**

```json
"fontFamily": {
    "displayName": "Familia de fuente",
    "type": {
        "enumeration": [
            { "value": "Arial, sans-serif", "displayName": "Arial" },
            ...
        ]
    }
},
"fontSize": {
    "displayName": "Tamaño de fuente base",
    "type": { "numeric": true }
}
```

**Después:**

```json
"fontFamily": {
    "displayName": "Familia de fuente",
    "type": { "formatting": { "fontFamily": true } }
},
"fontSize": {
    "displayName": "Tamaño de fuente",
    "type": { "formatting": { "fontSize": true } }
}
```

#### Razones:

- **fontFamily** ahora usa `formatting.fontFamily` en lugar de enumeration, permitiendo que FontControl use el selector de fuente nativo de Power BI
- **fontSize** usa `formatting.fontSize`, alineado con FontControl
- **bold/italic** mantienen `type: { bool: true }` (compatible con FontControl)
- Se agregó **underline** para completar el soporte B/I/U del FontControl
- **fontColor**, **lineHeight**, **letterSpacing** se mantienen como propiedades adicionales fuera del FontControl

---

### 2. **src/settings/typography.ts**

#### Cambios Realizados:

**Antes:** Clase `TypographySettings` con propiedades individuales

**Después:** Clase `TypographyCard` con estructura moderna:

```typescript
export class TypographyCard extends formattingSettings.SimpleCard {
  // FontControl - Control compuesto moderno
  font = new formattingSettings.FontControl({
    name: "font",
    displayName: "Fuente",
    fontFamily: new formattingSettings.FontPicker({...}),
    fontSize: new formattingSettings.NumUpDown({...}),
    bold: new formattingSettings.ToggleSwitch({...}),
    italic: new formattingSettings.ToggleSwitch({...}),
    underline: new formattingSettings.ToggleSwitch({...}),
  });

  // Propiedades adicionales
  fontColor: ColorPicker;
  lineHeight: NumUpDown;
  letterSpacing: NumUpDown;

  slices: [this.font, this.fontColor, this.lineHeight, this.letterSpacing]
}
```

#### Beneficios:

- ✅ FontControl agrupa visualmente familia + tamaño + B/I/U en una sola sección
- ✅ Propiedades adicionales (color, alto de línea, espaciado) se mantienen flexibles
- ✅ Estructura escalable para futuras mejoras
- ✅ Cumple con estándares de Power BI 2024+

---

### 3. **src/settings/general.ts**

#### Cambios Realizados:

**Removidas:**

- ❌ Clase `TypographyGroup` (movida a tarjeta separada)
- ❌ Importaciones de `FONT_FAMILY_OPTIONS`, `TYPOGRAPHY_DEFAULTS`
- ❌ Propiedades: fontFamily, fontSize, fontColor, lineHeight, letterSpacing, bold, italic

**Mantidas:**

- ✅ `StyleGroup` (tableStyle, textSize)
- ✅ `SelectionGroup` (rowSelection, rowSelectionColor)
- ✅ `NavigationGroup` (freezeCategories, pagination, rowsPerPage, scrollBehavior)
- ✅ `FeaturesGroup` (searchable, sortable)

**Estructura actualizada:**

```typescript
export class GeneralCompositeCard extends formattingSettings.CompositeCard {
  styleGroup = new StyleGroup();
  selectionGroup = new SelectionGroup(); // Nuevo orden (sin typographyGroup)
  navigationGroup = new NavigationGroup();
  featuresGroup = new FeaturesGroup();

  groups = [
    this.styleGroup,
    this.selectionGroup,
    this.navigationGroup,
    this.featuresGroup,
  ];
}
```

#### Razón de la Reorganización:

- Reduce complejidad de GeneralCompositeCard de 5 a 4 grupos
- Separa responsabilidades: General → estilo/interactividad general; Typography → tipografía dedicada
- Facilita futuras mejoras sin afectar otras configuraciones

---

### 4. **src/settings/index.ts**

#### Cambios Realizados:

**Antes:**

```typescript
export { TypographySettings } from "./typography";
```

**Después:**

```typescript
export { TypographyCard } from "./typography";
```

---

### 5. **src/settings.ts** (Modelo Principal)

#### Cambios Realizados:

**Antes:**

```typescript
export class VisualFormattingSettingsModel extends formattingSettings.Model {
  general: GeneralCompositeCard = new GeneralCompositeCard();
  grid: GridSettings = new GridSettings();
  // ... sin tarjeta de tipografía separada
  cards = [this.general, this.rows, this.grid, this.total];
}
```

**Después:**

```typescript
export class VisualFormattingSettingsModel extends formattingSettings.Model {
  general: GeneralCompositeCard = new GeneralCompositeCard();
  typography: TypographyCard = new TypographyCard(); // ← NUEVA
  grid: GridSettings = new GridSettings();
  // ...
  cards = [this.general, this.typography, this.rows, this.grid, this.total];
}
```

#### Flujo de Lectura en Visual:

**Rutas de acceso a valores tipográficos:**

- Familia: `this.formattingSettings.typography.font.fontFamily.value`
- Tamaño: `this.formattingSettings.typography.font.fontSize.value`
- Negrita: `this.formattingSettings.typography.font.bold.value`
- Cursiva: `this.formattingSettings.typography.font.italic.value`
- Subrayado: `this.formattingSettings.typography.font.underline.value`
- Color: `this.formattingSettings.typography.fontColor.value.value`
- Alto de línea: `this.formattingSettings.typography.lineHeight.value`
- Espaciado: `this.formattingSettings.typography.letterSpacing.value`

---

### 6. **src/visual.ts**

#### Cambios Realizados:

**Nuevo método helper:**

```typescript
public getTypographyStyle(): {
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: number;
  letterSpacing: string;
} {
  const font = this.formattingSettings.typography.font;
  const typography = this.formattingSettings.typography;

  return {
    fontFamily: font.fontFamily?.value || "Segoe UI, sans-serif",
    fontSize: `${font.fontSize?.value || 11}px`,
    fontColor: typography.fontColor?.value?.value || "#000000",
    fontWeight: (font.bold?.value) ? "bold" : "normal",
    fontStyle: (font.italic?.value) ? "italic" : "normal",
    textDecoration: (font.underline?.value) ? "underline" : "none",
    lineHeight: typography.lineHeight?.value || 1.4,
    letterSpacing: (typography.letterSpacing?.value || 0) !== 0
      ? `${typography.letterSpacing?.value}px`
      : "normal",
  };
}
```

#### Propósito:

- 🎯 Único punto de acceso para leer estilos tipográficos
- 🎯 Encapsula la complejidad de las rutas de acceso
- 🎯 Manejo de valores por defecto centralizado
- 🎯 Facilita pruebas unitarias

---

## Persistencia de Datos

### Mecanismo de Guardado/Carga

1. **Guardado Automático:**

   - Cuando el usuario cambia valores en el panel de Formato → Power BI actualiza `options.dataViews[0].metadata.objects.typography.*`
   - `FormattingSettingsService.populateFormattingSettingsModel()` parsea automáticamente estos valores

2. **Carga Automática:**

   - En `visual.update()`: `this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(...)`
   - Power BI restaura los valores guardados desde el servidor

3. **Valores Predeterminados:**
   - Se definen en `TypographyCard` constructor y `TYPOGRAPHY_DEFAULTS` en constants/visualDefaults.ts
   - Se aplican si el usuario nunca ha cambiado la configuración

### No hay cambios requeridos en la lógica de persistencia

✅ El sistema ya está implementado en FormattingSettingsService

---

## Compatibilidad y Migración

### ¿Qué sucede con los reportes existentes?

Los reportes existentes que tienen valores guardados en el objeto `typography` (antigua estructura) continuarán funcionando:

1. **Valores de enumeration (fontFamily antiguo):** Power BI mantiene compatibilidad inversa
2. **Estructura de propiedades:** Aunque renombramos la clase, el nombre en capabilities.json (`"typography"`) sigue siendo el mismo
3. **FormattingSettingsService:** Maneja automáticamente la reconciliación entre estructura antigua y nueva

### Posible breaking change (Mínimo)

Si algún código externo accedía directamente a `general.typographyGroup.*`, eso **ya no funcionará**:

**Antes:**

```typescript
formattingSettings.general.typographyGroup.fontFamily.value;
```

**Después:**

```typescript
formattingSettings.typography.font.fontFamily.value;
```

**Solución:** Usar el método helper `getTypographyStyle()` en lugar de acceso directo.

---

## Validación Realizada

### ✅ Compilación TypeScript

- No hay errores de tipo
- Todas las importaciones resuelven correctamente
- Las rutas de acceso a propiedades son válidas

### ✅ Estructura de capabilities.json

- Objeto `"typography"` definido correctamente
- Propiedades mapeadas a tipos soportados por Power BI
- Compatible con formattingModel.FontControl

### ✅ Exportaciones y Tipos

- `TypographyCard` exportada correctamente desde `settings/index.ts`
- `VisualFormattingSettingsModel.typescript` incluye propiedad `typography`
- Tipos `SparklineColumnSettings` y `ColumnConfigSettings` sin cambios

---

## Próximos Pasos Recomendados

### Fase 2: Aplicación en Componentes

Aunque el refactoring de configuraciones está completo, los componentes React aún necesitan ser actualizados para:

1. **Leer desde getTypographyStyle():**

   ```typescript
   const styles = (visual as Visual).getTypographyStyle();
   ```

   (Requiere pasar la referencia del visual a los componentes)

2. **Aplicar estilos a elementos:**
   - `<text>` en SVG
   - `<span>`, `<div>` en HTML
   - Headers de tabla

### Fase 3: Pruebas Integrales

- Verificar que los valores se guardan/cargan correctamente
- Probar cambios en el panel de Formato en tiempo real
- Validar visualmente que FontControl se muestra correctamente

---

## Notas de Arquitectura

### Principios Aplicados

1. **Single Responsibility Principle (SRP):**

   - `GeneralCompositeCard`: Estilo, selección, navegación, funcionalidades
   - `TypographyCard`: Solo tipografía
   - `getTypographyStyle()`: Solo lectura unificada de estilos

2. **DRY (Don't Repeat Yourself):**

   - Centralización de defaults en `TYPOGRAPHY_DEFAULTS`
   - Lectura única de propiedades en un método helper

3. **Escalabilidad:**
   - FontControl es extensible para agregar más propiedades en futuro
   - Estructura de cards permite agregar nuevas tarjetas sin afectar existentes

### Decisiones de Diseño

| Decisión                                                         | Razón                                                          |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| FontControl en lugar de propiedades individuales                 | API moderna de Power BI, mejor UX, agrupación visual           |
| Tarjeta separada de Typography                                   | Separación de responsabilidades, reduce complejidad de General |
| getTypographyStyle() como método público                         | Facilita acceso desde componentes, centraliza lógica           |
| Propiedades adicionales (color, lineHeight) fuera de FontControl | Flexibilidad, no todas pueden agruparse en FontControl         |

---

## Cómo Usar en el Código

### Leer valores tipográficos (FORMA CORRECTA)

```typescript
// En visual.ts o componentes que reciben referencia al visual:
const typographyStyle = visual.getTypographyStyle();

// Aplicar a elemento HTML:
element.style.fontFamily = typographyStyle.fontFamily;
element.style.fontSize = typographyStyle.fontSize;
element.style.color = typographyStyle.fontColor;
element.style.fontWeight = typographyStyle.fontWeight;
element.style.fontStyle = typographyStyle.fontStyle;
element.style.textDecoration = typographyStyle.textDecoration;
element.style.lineHeight = typographyStyle.lineHeight;
element.style.letterSpacing = typographyStyle.letterSpacing;
```

### Acceso directo (SI ES NECESARIO)

```typescript
// Acceso a propiedades individuales:
const fontFamily = formattingSettings.typography.font.fontFamily.value;
const fontSize = formattingSettings.typography.font.fontSize.value;
const bold = formattingSettings.typography.font.bold.value;
const italic = formattingSettings.typography.font.italic.value;
const fontColor = formattingSettings.typography.fontColor.value?.value;
```

---

## Checklist de Verificación

- [x] capabilities.json actualizado con formatting.fontFamily y formatting.fontSize
- [x] TypographyCard creada con FontControl
- [x] GeneralCompositeCard limpiada sin tipografía
- [x] settings.ts integra TypographyCard en cards[]
- [x] getTypographyStyle() implementado en visual.ts
- [x] Sin errores de compilación TypeScript
- [x] Estructura coherente sin duplicidades
- [x] Valores predeterminados centralizados

---

## Referencias

- [Power BI FormattingModel API](https://github.com/microsoft/PowerBI-visuals-utils-formattingmodel)
- [FontControl Documentation](https://microsoft.github.io/PowerBI-visuals/api/formatting-controls/font-control/)
- [FormattingSettings Best Practices](https://microsoft.github.io/PowerBI-visuals/styling-formatting/)

---

**Fecha de Refactorización:** 2026-01-13  
**Estado:** ✅ COMPLETO - LISTO PARA FASE 2 (APLICACIÓN EN COMPONENTES)
