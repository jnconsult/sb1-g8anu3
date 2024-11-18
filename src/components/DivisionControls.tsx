import { useState } from 'react';
import { ConeParams, Language, Division, DivisionOrientation } from '../types';
import { translations } from '../translations';

interface DivisionControlsProps {
  params: ConeParams;
  language: Language;
  divisions: Division[];
  onDivisionsChange: (divisions: Division[]) => void;
}

export default function DivisionControls({ params, language, divisions, onDivisionsChange }: DivisionControlsProps) {
  const [error, setError] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<DivisionOrientation>('vertical');

  const calculateHeight = (percentage: number): number => {
    return (params.height * percentage) / 100;
  };

  const calculateTopRadius = (percentage: number): number => {
    return (params.topRadius * percentage) / 100;
  };

  const calculateBottomRadius = (percentage: number): number => {
    return (params.bottomRadius * percentage) / 100;
  };

  const redistributePercentages = (divisions: Division[]) => {
    const totalPercentage = divisions.reduce((sum, div) => sum + div.percentage, 0);
    if (totalPercentage < 100 && divisions.length > 0) {
      const remainingPercentage = 100 - totalPercentage;
      const addPerDivision = remainingPercentage / divisions.length;
      return divisions.map(div => ({
        ...div,
        percentage: div.percentage + addPerDivision,
        height: calculateHeight(div.percentage + addPerDivision),
        topRadius: calculateTopRadius(div.percentage + addPerDivision),
        bottomRadius: calculateBottomRadius(div.percentage + addPerDivision)
      }));
    }
    return divisions;
  };

  const addDivision = () => {
    const totalPercentage = divisions.reduce((sum, div) => sum + div.percentage, 0);
    if (totalPercentage >= 100) {
      setError('Total percentage cannot exceed 100%');
      return;
    }

    const newPercentage = 100 - totalPercentage;
    const newDivision: Division = {
      id: Date.now(),
      percentage: newPercentage,
      height: calculateHeight(newPercentage),
      topRadius: calculateTopRadius(newPercentage),
      bottomRadius: calculateBottomRadius(newPercentage),
      orientation
    };

    onDivisionsChange([...divisions, newDivision]);
    setError(null);
  };

  const removeDivision = (id: number) => {
    const remainingDivisions = divisions.filter(div => div.id !== id);
    const updatedDivisions = redistributePercentages(remainingDivisions);
    onDivisionsChange(updatedDivisions);
    setError(null);
  };

  const updateDivisionPercentage = (id: number, newPercentage: number) => {
    const division = divisions.find(div => div.id === id);
    if (!division) return;

    const otherDivisionsTotal = divisions
      .filter(div => div.id !== id)
      .reduce((sum, div) => sum + div.percentage, 0);

    if (otherDivisionsTotal + newPercentage > 100) {
      setError('Total percentage cannot exceed 100%');
      return;
    }

    const updatedDivisions = divisions.map(div => {
      if (div.id === id) {
        return {
          ...div,
          percentage: newPercentage,
          height: calculateHeight(newPercentage),
          topRadius: calculateTopRadius(newPercentage),
          bottomRadius: calculateBottomRadius(newPercentage),
          orientation
        };
      }
      return div;
    });

    onDivisionsChange(updatedDivisions);
    setError(null);
  };

  const updateOrientation = (newOrientation: DivisionOrientation) => {
    setOrientation(newOrientation);
    const updatedDivisions = divisions.map(div => ({
      ...div,
      orientation: newOrientation
    }));
    onDivisionsChange(updatedDivisions);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {translations.section[language]}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              {translations.divisionOrientation[language]}:
            </label>
            <select
              value={orientation}
              onChange={(e) => updateOrientation(e.target.value as DivisionOrientation)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="vertical">{translations.vertical[language]}</option>
              <option value="horizontal">{translations.horizontal[language]}</option>
              <option value="both">{translations.both[language]}</option>
            </select>
          </div>
          <button
            onClick={addDivision}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={divisions.reduce((sum, div) => sum + div.percentage, 0) >= 100}
          >
            + Add Section
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {divisions.map((division) => (
          <div key={division.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={division.percentage}
                onChange={(e) => updateDivisionPercentage(division.id, Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              onClick={() => removeDivision(division.id)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-600">
        {translations.orientationHelp[language]}
      </p>
    </div>
  );
}