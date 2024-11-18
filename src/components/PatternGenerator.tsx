import { useEffect, useRef } from 'react';
import { ConeParams, Language } from '../types';
import { translations } from '../translations';
import { convertToMM, convertFromMM } from '../utils/conversions';

interface PatternGeneratorProps {
  params: ConeParams;
  language: Language;
}

export default function PatternGenerator({ params, language }: PatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    
    // Convert all measurements to mm for calculations
    const topRadius = convertToMM(params.topRadius, params.unit);
    const bottomRadius = convertToMM(params.bottomRadius, params.unit);
    
    // Calculate pattern dimensions
    const maxRadius = Math.max(topRadius, bottomRadius);
    
    // Calculate canvas dimensions and scaling
    const margin = 30; // Reduced margin for smaller canvas
    const maxDimension = maxRadius * 2.2; // Reduced scaling factor
    const scale = (Math.min(canvas.width, canvas.height) - margin * 2) / maxDimension;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up the coordinate system
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    
    // Draw pattern
    ctx.beginPath();
    
    // Draw complete circles for top and bottom
    ctx.arc(0, 0, topRadius, 0, Math.PI * 2);
    ctx.moveTo(bottomRadius, 0);
    ctx.arc(0, 0, bottomRadius, 0, Math.PI * 2);
    
    // Style
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2 / scale;
    ctx.stroke();
    
    // Add measurements
    ctx.font = `${12 / scale}px sans-serif`; // Reduced font size
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    
    // Format numbers based on unit system
    const formatValue = (value: number) => {
      const converted = convertFromMM(value, params.unit);
      return params.unit === 'mm' ? 
        Math.round(converted).toString() : 
        converted.toFixed(3);
    };
    
    // Add radius labels with reduced spacing
    ctx.fillText(
      `${translations.topRadius[language]}: ${formatValue(topRadius)}${params.unit}`,
      0,
      -topRadius - 5 / scale
    );
    
    ctx.fillText(
      `${translations.bottomRadius[language]}: ${formatValue(bottomRadius)}${params.unit}`,
      0,
      bottomRadius + 15 / scale
    );
    
    // Add diameter lines and measurements with reduced spacing
    const drawDiameterLine = (radius: number, yOffset: number) => {
      ctx.beginPath();
      ctx.moveTo(-radius, yOffset);
      ctx.lineTo(radius, yOffset);
      ctx.strokeStyle = '#9ca3af';
      ctx.setLineDash([4 / scale, 4 / scale]);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Draw diameter lines
    drawDiameterLine(topRadius, -topRadius / 2);
    drawDiameterLine(bottomRadius, bottomRadius / 2);

    // Add diameter measurements with reduced spacing
    ctx.fillText(
      `∅ ${formatValue(topRadius * 2)}${params.unit}`,
      0,
      -topRadius / 2 - 3 / scale
    );
    
    ctx.fillText(
      `∅ ${formatValue(bottomRadius * 2)}${params.unit}`,
      0,
      bottomRadius / 2 + 12 / scale
    );
    
    ctx.restore();
  }, [params, language]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        {translations.cuttingTemplateTop[language]}
      </h2>
      <canvas 
        ref={canvasRef}
        width={600} // Reduced width
        height={400} // Reduced height
        className="w-full border border-gray-200 rounded-lg bg-white"
      />
      <p className="mt-2 text-sm text-gray-600">
        {translations.templateHelp[language]} {params.unit}
      </p>
    </div>
  );
}