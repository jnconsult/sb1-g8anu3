export interface ConeParams {
  topRadius: number;
  bottomRadius: number;
  height: number;
  unit: 'mm' | 'in';
  topAngle: number;
  bottomAngle: number;
  autoClose: boolean;
}

export type Language = 'en' | 'es';

export type DivisionOrientation = 'vertical' | 'horizontal' | 'both';

export interface Division {
  id: number;
  percentage: number;
  height?: number;
  topRadius?: number;
  bottomRadius?: number;
  orientation?: DivisionOrientation;
}

export interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}