import { useEffect, useRef } from 'react';
import { ConeParams, Language, Division } from '../types';
import { translations } from '../translations';
import { convertFromMM } from '../utils/conversions';

interface SectionPatternGeneratorProps {
  params: ConeParams;
  language: Language;
  divisions: Division[];
}

export default function SectionPatternGenerator({ params, language, divisions }: SectionPatternGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawSection = (
    ctx: CanvasRenderingContext2D,
    division: Division,
    x: number,
    y: number,
    scale: number,
    formatValue: (value: number) => string,
    index: number
  ) => {
    if (!division.topRadius || !division.bottomRadius || !division.height) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Draw side view pattern (trapezoid)
    ctx.beginPath();
    ctx.moveTo(-division.bottomRadius, division.height/2);
    ctx.lineTo(-division.topRadius, -division.height/2);
    ctx.lineTo(division.topRadius, -division.height/2);
    ctx.lineTo(division.bottomRadius, division.height/2);
    ctx.closePath();

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2 / scale;
    ctx.stroke();

    // Add measurements and labels
    ctx.font = `${14 / scale}px sans-serif`;
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';

    // Section label
    ctx.fillText(
      `${translations.section[language]} ${index + 1} - ${division.percentage}%`,
      0,
      -division.height/2 - 30 / scale
    );

    // Width labels
    ctx.fillText(
      `${formatValue(division.topRadius * 2)}${params.unit}`,
      0,
      -division.height/2 - 10 / scale
    );

    ctx.fillText(
      `${formatValue(division.bottomRadius * 2)}${params.unit}`,
      0,
      division.height/2 + 20 / scale
    );

    // Height label
    ctx.save();
    ctx.translate(-division.bottomRadius - 20 / scale, 0);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(
      `${formatValue(division.height)}${params.unit}`,
      0,
      0
    );
    ctx.restore();

    ctx.restore();
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    
    // Calculate grid layout
    const margin = 50;
    const patternWidth = 300;
    const patternHeight = 300;
    const patternsPerRow = Math.floor((canvas.width - margin) / (patternWidth + margin));
    const rows = Math.ceil(divisions.length / patternsPerRow);
    
    // Adjust canvas height based on number of rows
    canvas.height = rows * (patternHeight + margin) + margin;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const formatValue = (value: number) => {
      const converted = convertFromMM(value, params.unit);
      return params.unit === 'mm' ? 
        Math.round(converted).toString() : 
        converted.toFixed(3);
    };

    divisions.forEach((division, index) => {
      if (!division.topRadius || !division.bottomRadius || !division.height) return;

      // Calculate grid position
      const row = Math.floor(index / patternsPerRow);
      const col = index % patternsPerRow;
      const x = margin + col * (patternWidth + margin) + patternWidth/2;
      const y = margin + row * (patternHeight + margin) + patternHeight/2;

      // Calculate scale based on pattern dimensions
      const maxRadius = Math.max(division.topRadius, division.bottomRadius);
      const maxHeight = division.height;
      const scale = Math.min(
        (patternWidth - margin) / (maxRadius * 2.5),
        (patternHeight - margin) / (maxHeight * 1.5)
      );

      drawSection(ctx, division, x, y, scale, formatValue, index);
    });
  }, [params, divisions, language]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        {translations.sectionPatterns[language]}
      </h2>
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full border border-gray-200 rounded-lg bg-white"
      />
      <p className="mt-2 text-sm text-gray-600">
        {translations.sectionPatternsHelp[language]} {params.unit}
      </p>
    </div>
  );
}