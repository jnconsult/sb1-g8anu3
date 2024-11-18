import { ConeParams, Language } from '../types';
import { translations } from '../translations';

interface ControlsProps {
  params: ConeParams;
  onChange: (params: ConeParams) => void;
  language: Language;
}

export default function Controls({ params, onChange, language }: ControlsProps) {
  const handleChange = (field: keyof ConeParams) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: string | number | boolean = e.target.value;
    
    if (field === 'unit') {
      value = e.target.value;
      // Convert values when changing units
      const conversionFactor = value === 'mm' ? 25.4 : 1/25.4;
      onChange({
        ...params,
        unit: value as 'mm' | 'in',
        topRadius: Number((params.topRadius * conversionFactor).toFixed(3)),
        bottomRadius: Number((params.bottomRadius * conversionFactor).toFixed(3)),
        height: Number((params.height * conversionFactor).toFixed(3))
      });
      return;
    } else if (field === 'autoClose') {
      value = (e.target as HTMLInputElement).checked;
      
      if (value) {
        onChange({
          ...params,
          autoClose: value as boolean,
          topAngle: 360,
          bottomAngle: 360
        });
        return;
      }
    } else if (field === 'topAngle' || field === 'bottomAngle') {
      value = Math.min(360, Math.max(1, parseFloat(value) || 0));
    } else {
      // Handle decimal precision based on unit
      const precision = params.unit === 'in' ? 3 : 1;
      value = Number(Math.max(0.001, parseFloat(value) || 0).toFixed(precision));
    }
    
    onChange({
      ...params,
      [field]: value
    });
  };

  const step = params.unit === 'mm' ? '1' : '0.001';
  const min = params.unit === 'mm' ? '1' : '0.001';

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{translations.dimensions[language]}</h2>
      <div className="space-y-4">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            {translations.unitSystem[language]}
          </label>
          <select
            value={params.unit}
            onChange={handleChange('unit')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="in">{translations.imperial[language]}</option>
            <option value="mm">{translations.metric[language]}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translations.topRadius[language]} ({params.unit})
            </label>
            <input
              type="number"
              min={min}
              step={step}
              value={params.topRadius}
              onChange={handleChange('topRadius')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translations.topArcAngle[language]} (°)
            </label>
            <input
              type="number"
              min="1"
              max="360"
              step="1"
              value={params.topAngle}
              onChange={handleChange('topAngle')}
              disabled={params.autoClose}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translations.bottomRadius[language]} ({params.unit})
            </label>
            <input
              type="number"
              min={min}
              step={step}
              value={params.bottomRadius}
              onChange={handleChange('bottomRadius')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {translations.bottomArcAngle[language]} (°)
            </label>
            <input
              type="number"
              min="1"
              max="360"
              step="1"
              value={params.bottomAngle}
              onChange={handleChange('bottomAngle')}
              disabled={params.autoClose}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {translations.height[language]} ({params.unit})
          </label>
          <input
            type="number"
            min={min}
            step={step}
            value={params.height}
            onChange={handleChange('height')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="autoClose"
            type="checkbox"
            checked={params.autoClose}
            onChange={handleChange('autoClose')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="autoClose" className="ml-2 block text-sm text-gray-700">
            {translations.createClosedCylinder[language]}
          </label>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          {params.autoClose ? 
            translations.closedCylinderMessage[language] :
            translations.manualAdjustMessage[language]
          }
        </p>
      </div>
    </div>
  );
}