/**
 * Utilidades para debugging y profiling de performance
 * Solo activas en modo desarrollo
 */

// En Power BI visuals, verificar si estamos en desarrollo
const isDevelopment =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname.includes("127.0.0.1"));

/**
 * Logger de renders para React.memo
 */
export function logRenderDecision(
  componentName: string,
  didRender: boolean,
  reason?: string
): void {
  if (!isDevelopment) return;

  if (didRender) {
    console.log(
      `🔄 ${componentName} RE-RENDERED${reason ? `: ${reason}` : ""}`
    );
  } else {
    console.log(`✅ ${componentName} SKIP RENDER (memoized)`);
  }
}

/**
 * Logger de operaciones memoizadas
 */
export function logMemoization(operation: string, recalculated: boolean): void {
  if (!isDevelopment) return;

  if (recalculated) {
    console.log(`🔄 ${operation} - recalculated`);
  } else {
    console.log(`✅ ${operation} - using cached value`);
  }
}

/**
 * Timer para medir performance
 */
export class PerformanceTimer {
  private timers: Map<string, number> = new Map();

  start(label: string): void {
    if (!isDevelopment) return;
    this.timers.set(label, performance.now());
  }

  end(label: string, logThreshold: number = 0): number | undefined {
    if (!isDevelopment) return;

    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`⚠️ Timer "${label}" was not started`);
      return;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(label);

    if (duration >= logThreshold) {
      const emoji = duration > 50 ? "🐌" : duration > 10 ? "⚡" : "✨";
      console.log(`${emoji} ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }
}

/**
 * Singleton para usar en toda la aplicación
 */
export const perfTimer = new PerformanceTimer();

/**
 * Log de cambios en Maps
 */
export function logMapChanges<K, V>(
  mapName: string,
  oldMap: Map<K, V>,
  newMap: Map<K, V>
): void {
  if (!isDevelopment) return;

  if (oldMap === newMap) {
    console.log(`✅ ${mapName}: Same reference (optimized)`);
    return;
  }

  if (oldMap.size !== newMap.size) {
    console.log(
      `🔄 ${mapName}: Size changed (${oldMap.size} → ${newMap.size})`
    );
    return;
  }

  const changes: string[] = [];
  for (const [key, value] of newMap) {
    if (!oldMap.has(key)) {
      changes.push(`+${String(key)}`);
    } else if (oldMap.get(key) !== value) {
      changes.push(`~${String(key)}`);
    }
  }

  for (const key of oldMap.keys()) {
    if (!newMap.has(key)) {
      changes.push(`-${String(key)}`);
    }
  }

  if (changes.length > 0) {
    console.log(`🔄 ${mapName}: Content changed [${changes.join(", ")}]`);
  } else {
    console.log(`✅ ${mapName}: Content unchanged`);
  }
}

/**
 * Comparador de props para debugging
 */
export function logPropsComparison(
  componentName: string,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>,
  criticalProps: string[]
): void {
  if (!isDevelopment) return;

  const changes: string[] = [];

  for (const prop of criticalProps) {
    if (prevProps[prop] !== nextProps[prop]) {
      const prevValue = JSON.stringify(prevProps[prop]);
      const nextValue = JSON.stringify(nextProps[prop]);
      changes.push(`${prop}: ${prevValue} → ${nextValue}`);
    }
  }

  if (changes.length > 0) {
    console.group(`🔍 ${componentName} props changed:`);
    changes.forEach((change) => console.log(`  • ${change}`));
    console.groupEnd();
  }
}

/**
 * Monitor de uso de memoria (aproximado)
 */
export function logMemoryUsage(label: string): void {
  if (!isDevelopment) return;

  if (typeof performance !== "undefined" && "memory" in performance) {
    const memory = (performance as any).memory;
    const used = (memory.usedJSHeapSize / 1048576).toFixed(2);
    const total = (memory.totalJSHeapSize / 1048576).toFixed(2);
    console.log(`💾 ${label}: ${used}MB / ${total}MB`);
  }
}
