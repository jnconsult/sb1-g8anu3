import { useState } from 'react';
import ConeViewer from './components/ConeViewer';
import Controls from './components/Controls';
import PatternGenerator from './components/PatternGenerator';
import SidePatternGenerator from './components/SidePatternGenerator';
import DivisionControls from './components/DivisionControls';
import SectionPatternGenerator from './components/SectionPatternGenerator';
import ExportOptions from './components/ExportOptions';
import LanguageToggle from './components/LanguageToggle';
import ProjectName from './components/ProjectName';
import { ConeParams, Language } from './types';
import { translations } from './translations';

interface Division {
  id: number;
  percentage: number;
  height?: number;
  topRadius?: number;
  bottomRadius?: number;
}

export default function App() {
  const [params, setParams] = useState<ConeParams>({
    topRadius: 2.000,
    bottomRadius: 4.000,
    height: 8.000,
    unit: 'in',
    topAngle: 180,
    bottomAngle: 180,
    autoClose: false
  });

  const [language, setLanguage] = useState<Language>('en');
  const [projectName, setProjectName] = useState<string>('');
  const [divisions, setDivisions] = useState<Division[]>([
    { id: 1, percentage: 100 }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <LanguageToggle language={language} onChange={setLanguage} />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {translations.title[language]}
              </h1>
              <p className="text-gray-600">
                {translations.subtitle[language]}
              </p>
              <ProjectName 
                value={projectName} 
                onChange={setProjectName} 
                language={language}
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {translations.copyright[language]}
              </p>
              <p className="text-sm font-medium text-blue-600">
                {translations.createdBy[language]}
              </p>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Controls params={params} onChange={setParams} language={language} />
            <ConeViewer params={params} language={language} />
            <DivisionControls 
              params={params} 
              language={language}
              divisions={divisions}
              onDivisionsChange={setDivisions}
            />
            <ExportOptions 
              params={params} 
              language={language} 
              projectName={projectName}
            />
          </div>
          
          <div className="space-y-8">
            <PatternGenerator params={params} language={language} />
            <SidePatternGenerator params={params} language={language} />
            <SectionPatternGenerator 
              params={params} 
              language={language}
              divisions={divisions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}