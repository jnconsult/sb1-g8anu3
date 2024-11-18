export function convertToMM(value: number, unit: 'mm' | 'in'): number {
  return unit === 'mm' ? value : value * 25.4;
}

export function convertFromMM(value: number, unit: 'mm' | 'in'): number {
  return unit === 'mm' ? value : value / 25.4;
}