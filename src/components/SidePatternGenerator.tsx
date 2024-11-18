import { useEffect, useRef } from 'react';
import { ConeParams, Language } from '../types';
import { translations } from '../translations';
import { convertToMM, convertFromMM } from '../utils/conversions';

interface SidePatternGeneratorProps {
  params: ConeParams;
  language: Language;
}

export default function SidePatternGenerator({ params, language }: SidePatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    
    // Convert all measurements to mm for calculations
    const topRadius = convertToMM(params.topRadius, params.unit);
    const bottomRadius = convertToMM(params.bottomRadius, params.unit);
    const height = convertToMM(params.height, params.unit);
    
    // Calculate canvas dimensions and scaling
    const margin = 50;
    const maxWidth = (bottomRadius + topRadius) * 2;
    const maxHeight = height;
    const scale = Math.min(
      (canvas.width - margin * 2) / maxWidth,
      (canvas.height - margin * 2) / maxHeight
    );
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up the coordinate system
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);
    
    // Draw side view
    ctx.beginPath();
    ctx.moveTo(-bottomRadius, height/2);
    ctx.lineTo(-topRadius, -height/2);
    ctx.lineTo(topRadius, -height/2);
    ctx.lineTo(bottomRadius, height/2);
    ctx.closePath();
    
    // Style
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2 / scale;
    ctx.stroke();
    
    // Add measurements
    ctx.font = `${14 / scale}px sans-serif`;
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    
    // Format numbers based on unit system
    const formatValue = (value: number) => {
      const converted = convertFromMM(value, params.unit);
      return params.unit === 'mm' ? 
        Math.round(converted).toString() : 
        converted.toFixed(3);
    };
    
    // Add width labels
    ctx.fillText(
      `${formatValue(topRadius * 2)}${params.unit}`,
      0,
      -height/2 - 10 / scale
    );
    
    ctx.fillText(
      `${formatValue(bottomRadius * 2)}${params.unit}`,
      0,
      height/2 + 20 / scale
    );
    
    // Add height label
    ctx.save();
    ctx.translate(-bottomRadius - 20 / scale, 0);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(
      `${formatValue(height)}${params.unit}`,
      0,
      0
    );
    ctx.restore();
    
    ctx.restore();
  }, [params]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        {translations.cuttingTemplateSide[language]}
      </h2>
      <canvas 
        ref={canvasRef}
        id="sidePatternCanvas"
        width={800} 
        height={400}
        className="w-full border border-gray-200 rounded-lg bg-white"
      />
      <p className="mt-2 text-sm text-gray-600">
        {translations.templateHelp[language]} {params.unit}
      </p>
    </div>
  );
}