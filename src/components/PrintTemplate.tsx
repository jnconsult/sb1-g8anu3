import { ConeParams, Language } from '../types';
import { translations } from '../translations';
import { convertFromMM } from '../utils/conversions';

interface PrintTemplateProps {
  params: ConeParams;
  language: Language;
}

export default function PrintTemplate({ params, language }: PrintTemplateProps) {
  const formatValue = (value: number) => {
    const converted = convertFromMM(value, params.unit);
    return params.unit === 'mm' ? 
      Math.round(converted).toString() : 
      converted.toFixed(3);
  };

  return (
    <div className="print-only">
      <style type="text/css" media="print">{`
        @page {
          size: auto;
          margin: 10mm;
        }
        @media print {
          .print-only {
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{translations.title[language]}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {translations.createdBy[language]} - {new Date().toLocaleDateString()}
        </p>
        <div className="text-sm">
          <p><strong>{translations.dimensions[language]}:</strong></p>
          <ul className="list-disc ml-4">
            <li>{translations.topRadius[language]}: {formatValue(params.topRadius)}{params.unit}</li>
            <li>{translations.bottomRadius[language]}: {formatValue(params.bottomRadius)}{params.unit}</li>
            <li>{translations.height[language]}: {formatValue(params.height)}{params.unit}</li>
            <li>{translations.topArcAngle[language]}: {params.topAngle}°</li>
            <li>{translations.bottomArcAngle[language]}: {params.bottomAngle}°</li>
          </ul>
        </div>
      </div>

      <div className="page-break-after">
        <h2 className="text-xl font-semibold mb-4">{translations.cuttingTemplateTop[language]}</h2>
        <canvas id="printTopView" className="border border-gray-300 mb-4"></canvas>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">{translations.cuttingTemplateSide[language]}</h2>
        <canvas id="printSideView" className="border border-gray-300 mb-4"></canvas>
      </div>
    </div>
  );
}