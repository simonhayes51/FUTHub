/**
 * Deterministic pseudo-random helpers.
 * Same seed → same output, so simulations/estimates are stable and explainable.
 */

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic unit float in [0, 1) seeded by a string. */
export function seededUnit(seed: string): number {
  return hashString(seed) / 4294967295;
}

/** A mulberry32 PRNG factory seeded from a string — returns a next() function. */
export function seededRng(seed: string): () => number {
  let a = hashString(seed);
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick one item deterministically from a list. */
export function seededPick<T>(seed: string, items: T[]): T {
  return items[Math.floor(seededUnit(seed) * items.length) % items.length];
}
