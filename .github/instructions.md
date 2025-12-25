---
applyTo: "**"
description: Instrucciones para GitHub Copilot sobre desarrollo de Power BI Custom Visuals con React y TypeScript
---

# Power BI Visual Object - Instrucciones para AI

## Arquitectura del Proyecto

Este es un **Power BI Custom Visual**, la arquitectura sigue el patrón oficial de Power BI Visuals.

### Flujo de Datos Power BI

1. **Power BI envía datos** vía `VisualUpdateOptions` con estructura `DataView`
2. **Visual.ts** procesa `DataView` y transforma datos a una estructura interna
3. **Logging y Manejo de Errores**: Consola con emojis y renderizado de errores en DOM
4. **Renderizado**: Usando D3.js para manipular DOM y React para componentes UI

## Convenciones de Codificación

### Nombres

- Usa PascalCase para nombres de componentes, interfaces y alias de tipos
- Usa camelCase para variables, funciones y métodos
- Prefija los miembros privados de la clase con un guion bajo (\_)
- Usa MAYÚSCULAS para las constantes y enums

### Manejo de Errores

- Usa bloques try/catch donde sea apropiado
- Implementa límites de error adecuados en componentes de React
- Siempre registra los errores con información contextual

## Comandos Esenciales

```bash
pbiviz start          # Inicia pbiviz en modo desarrollo (watch + certificado SSL)
pbiviz package        # Genera .pbiviz para distribución
pbiviz lint       # ESLint con plugin powerbi-visuals
```

**Debugging**: `pbiviz start` lanza servidor dev en https://localhost:8080. En el navegador, abre Power BI Service, habilitar "Developer Visual" e inspeccionar consola del navegador (Edge DevTools) para revisar errores y mensajes de depuración.
