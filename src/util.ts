export function match(s: string, regexp: RegExp) {
  return Array.from(s.matchAll(regexp));
}

export function matchNumbers(s: string): number[] {
  return match(s, /(-?\d+)/g).map((m) => parseInt(m[0]));
}

export function sum(acc: number, n: number): number {
  return acc + n;
}
