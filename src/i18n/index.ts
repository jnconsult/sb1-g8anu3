import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: 'Cone Pattern Designer',
      subtitle: 'Design and export truncated cone patterns for sheet metal fabrication',
      copyright: '© 2024 Orijen Tools. All rights reserved.',
      dimensions: 'Dimensions',
      unitSystem: 'Unit System',
      metric: 'Metric (mm)',
      imperial: 'Imperial (inches)',
      topRadius: 'Top Radius',
      bottomRadius: 'Bottom Radius',
      height: 'Height',
      topAngle: 'Top Angle',
      bottomAngle: 'Bottom Angle',
      autoClose: 'Auto Close',
      preview3D: '3D Preview',
      preview2DTop: 'Top View Pattern',
      preview2DSide: 'Side View Pattern',
      exportOptions: 'Export Options',
      exportDXF: 'Export DXF',
      exportEPS: 'Export EPS',
      exportCoordinates: 'Export Coordinates',
      print: 'Print Templates',
      language: 'Language'
    }
  },
  es: {
    translation: {
      title: 'Diseñador de Patrones de Cono',
      subtitle: 'Diseñe y exporte patrones de conos truncados para fabricación en metal',
      copyright: '© 2024 Orijen Tools. Todos los derechos reservados.',
      dimensions: 'Dimensiones',
      unitSystem: 'Sistema de Unidades',
      metric: 'Métrico (mm)',
      imperial: 'Imperial (pulgadas)',
      topRadius: 'Radio Superior',
      bottomRadius: 'Radio Inferior',
      height: 'Altura',
      topAngle: 'Ángulo Superior',
      bottomAngle: 'Ángulo Inferior',
      autoClose: 'Cierre Automático',
      preview3D: 'Vista Previa 3D',
      preview2DTop: 'Patrón Vista Superior',
      preview2DSide: 'Patrón Vista Lateral',
      exportOptions: 'Opciones de Exportación',
      exportDXF: 'Exportar DXF',
      exportEPS: 'Exportar EPS',
      exportCoordinates: 'Exportar Coordenadas',
      print: 'Imprimir Plantillas',
      language: 'Idioma'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;