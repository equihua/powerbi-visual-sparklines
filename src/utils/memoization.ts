/**
 * Utilidades para memoización y comparación de objetos
 */

/**
 * Compara dos Maps de manera superficial
 */
export function areMapsEqual<K, V>(map1: Map<K, V>, map2: Map<K, V>): boolean {
  if (map1.size !== map2.size) return false;

  for (const [key, val1] of map1) {
    const val2 = map2.get(key);
    if (!val2 || !shallowEqual(val1, val2)) return false;
  }

  return true;
}

/**
 * Comparación superficial de dos objetos
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Genera un hash simple de un objeto para detectar cambios
 */
export function generateHash(data: any): string {
  return JSON.stringify(data, (key, value) => {
    // Ordenar claves de objetos para hash consistente
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((sorted: any, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {});
    }
    return value;
  });
}

/**
 * Compara dos arrays de manera superficial
 */
export function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}
