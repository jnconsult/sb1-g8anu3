import { Language } from '../types';
import { translations } from '../translations';

interface ProjectNameProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
}

export default function ProjectName({ value, onChange, language }: ProjectNameProps) {
  return (
    <div className="max-w-md">
      <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
        {translations.projectName[language]}
      </label>
      <input
        type="text"
        id="projectName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={translations.projectNamePlaceholder[language]}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
}