import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-md p-2">
      <div className="flex space-x-2">
        <button
          onClick={() => onChange('en')}
          className={`px-3 py-1 rounded ${
            language === 'en'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onChange('es')}
          className={`px-3 py-1 rounded ${
            language === 'es'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ES
        </button>
      </div>
    </div>
  );
}