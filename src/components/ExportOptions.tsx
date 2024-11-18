import { saveAs } from 'file-saver';
import { ConeParams, Language } from '../types';
import { translations } from '../translations';
import { generateDXF, generateEPS, generateCoordinates } from '../utils/exportFormats';

interface ExportOptionsProps {
  params: ConeParams;
  language: Language;
  projectName: string;
}

export default function ExportOptions({ params, language, projectName }: ExportOptionsProps) {
  const getFileName = (extension: string) => {
    const baseName = projectName.trim() ? 
      projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase() :
      'cone-pattern';
    return `${baseName}.${extension}`;
  };

  const exportDXF = () => {
    const dxfContent = generateDXF(params);
    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    saveAs(blob, getFileName('dxf'));
  };

  const exportEPS = () => {
    const epsContent = generateEPS(params);
    const blob = new Blob([epsContent], { type: 'application/postscript' });
    saveAs(blob, getFileName('eps'));
  };

  const exportCoordinates = () => {
    const coordinates = generateCoordinates(params);
    const blob = new Blob([coordinates], { type: 'text/plain' });
    saveAs(blob, getFileName('txt'));
  };

  const printTemplates = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formatValue = (value: number) => {
      return params.unit === 'mm' ? 
        Math.round(value).toString() : 
        value.toFixed(3);
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${projectName || translations.printTemplates[language]}</title>
          <style>
            @page {
              size: letter;
              margin: 0.5in;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #1f2937;
            }
            .page {
              width: 8.5in;
              height: 11in;
              padding: 0.5in;
              box-sizing: border-box;
              page-break-after: always;
            }
            .header {
              margin-bottom: 0.5in;
            }
            .template {
              margin-bottom: 0.5in;
            }
            canvas {
              max-width: 7.5in;
              height: auto;
              border: 1px solid #e5e7eb;
              margin: 0.25in 0;
            }
            .dimensions {
              margin: 0.25in 0;
              padding: 0.25in;
              border: 1px solid #e5e7eb;
              background: #f9fafb;
            }
            .dimensions table {
              width: 100%;
              border-collapse: collapse;
            }
            .dimensions td {
              padding: 0.125in;
              border-bottom: 1px solid #e5e7eb;
            }
            .dimensions td:first-child {
              font-weight: bold;
              width: 40%;
            }
            h1 { font-size: 24pt; margin: 0 0 0.25in 0; }
            h2 { font-size: 18pt; margin: 0 0 0.25in 0; }
            p { margin: 0 0 0.125in 0; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <h1>${projectName || translations.title[language]}</h1>
              <p>${translations.createdBy[language]}</p>
              <p>${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="dimensions">
              <table>
                <tr>
                  <td>${translations.topRadius[language]}</td>
                  <td>${formatValue(params.topRadius)} ${params.unit}</td>
                </tr>
                <tr>
                  <td>${translations.bottomRadius[language]}</td>
                  <td>${formatValue(params.bottomRadius)} ${params.unit}</td>
                </tr>
                <tr>
                  <td>${translations.height[language]}</td>
                  <td>${formatValue(params.height)} ${params.unit}</td>
                </tr>
                <tr>
                  <td>${translations.topArcAngle[language]}</td>
                  <td>${params.topAngle}°</td>
                </tr>
                <tr>
                  <td>${translations.bottomArcAngle[language]}</td>
                  <td>${params.bottomAngle}°</td>
                </tr>
              </table>
            </div>

            <div class="template">
              <h2>${translations.cuttingTemplateTop[language]}</h2>
              <canvas id="printTopView"></canvas>
            </div>
          </div>

          <div class="page">
            <div class="template">
              <h2>${translations.cuttingTemplateSide[language]}</h2>
              <canvas id="printSideView"></canvas>
            </div>
          </div>
        </body>
      </html>
    `);

    // Get the source canvases
    const topCanvas = document.getElementById('patternCanvas') as HTMLCanvasElement;
    const sideCanvas = document.getElementById('sidePatternCanvas') as HTMLCanvasElement;

    if (topCanvas && sideCanvas) {
      // Set up print canvases
      const printTopView = printWindow.document.getElementById('printTopView') as HTMLCanvasElement;
      const printSideView = printWindow.document.getElementById('printSideView') as HTMLCanvasElement;

      if (printTopView && printSideView) {
        // Calculate scaling to fit letter size paper (7.5in usable width)
        const letterWidth = 7.5 * 96; // 7.5 inches in pixels (96 DPI)
        
        // Copy and scale top view pattern
        printTopView.width = topCanvas.width;
        printTopView.height = topCanvas.height;
        const topCtx = printTopView.getContext('2d');
        if (topCtx) {
          topCtx.clearRect(0, 0, printTopView.width, printTopView.height);
          topCtx.drawImage(topCanvas, 0, 0);
          const scaleTop = Math.min(letterWidth / printTopView.width, 1);
          printTopView.style.width = `${printTopView.width * scaleTop}px`;
          printTopView.style.height = `${printTopView.height * scaleTop}px`;
        }

        // Copy and scale side view pattern
        printSideView.width = sideCanvas.width;
        printSideView.height = sideCanvas.height;
        const sideCtx = printSideView.getContext('2d');
        if (sideCtx) {
          sideCtx.clearRect(0, 0, printSideView.width, printSideView.height);
          sideCtx.drawImage(sideCanvas, 0, 0);
          const scaleSide = Math.min(letterWidth / printSideView.width, 1);
          printSideView.style.width = `${printSideView.width * scaleSide}px`;
          printSideView.style.height = `${printSideView.height * scaleSide}px`;
        }
      }
    }

    printWindow.document.close();
    
    // Wait for images to load before printing
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{translations.exportOptions[language]}</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={exportDXF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          title={translations.exportDXFHelp[language]}
        >
          {translations.exportDXF[language]}
        </button>
        <button
          onClick={exportEPS}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          title={translations.exportEPSHelp[language]}
        >
          {translations.exportEPS[language]}
        </button>
        <button
          onClick={exportCoordinates}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          title={translations.exportCoordinatesHelp[language]}
        >
          {translations.exportCoordinates[language]}
        </button>
        <button
          onClick={printTemplates}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
          title={translations.printTemplatesHelp[language]}
        >
          {translations.printTemplates[language]}
        </button>
      </div>
    </div>
  );
}