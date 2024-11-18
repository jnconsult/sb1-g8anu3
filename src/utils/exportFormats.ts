import { ConeParams } from '../types';

function calculatePatternPoints(params: ConeParams) {
  const { topRadius, bottomRadius, height, topAngle, bottomAngle } = params;
  const slantHeight = Math.sqrt(Math.pow(height, 2) + Math.pow(bottomRadius - topRadius, 2));
  const topRadians = (topAngle * Math.PI) / 180;
  const bottomRadians = (bottomAngle * Math.PI) / 180;
  
  const segments = 72;
  const points = {
    top: [] as [number, number][],
    bottom: [] as [number, number][],
    side: [] as [number, number][]
  };

  // Generate top view points
  for (let i = 0; i <= segments; i++) {
    const topTheta = -topRadians / 2 + (i * topRadians / segments);
    const bottomTheta = -bottomRadians / 2 + (i * bottomRadians / segments);
    
    points.top.push([
      topRadius * Math.cos(topTheta),
      topRadius * Math.sin(topTheta) - slantHeight / 2
    ]);
    
    points.bottom.push([
      bottomRadius * Math.cos(bottomTheta),
      bottomRadius * Math.sin(bottomTheta) + slantHeight / 2
    ]);
  }

  // Generate side view points
  points.side = [
    [-bottomRadius, height/2],
    [-topRadius, -height/2],
    [topRadius, -height/2],
    [bottomRadius, height/2]
  ];

  return points;
}

export function generateDXF(params: ConeParams): string {
  const points = calculatePatternPoints(params);
  
  const dxf = [
    '0',
    'SECTION',
    '2',
    'ENTITIES',
    // Top view pattern
    '0',
    'POLYLINE',
    '8',
    'TOP_VIEW',
    '66',
    '1',
    '70',
    '1',
    '0'
  ];

  // Add top view vertices
  [...points.top, ...points.bottom.reverse()].forEach(([x, y]) => {
    dxf.push(
      'VERTEX',
      '8',
      'TOP_VIEW',
      '10',
      x.toString(),
      '20',
      y.toString(),
      '0'
    );
  });

  dxf.push('SEQEND');

  // Side view pattern
  dxf.push(
    '0',
    'POLYLINE',
    '8',
    'SIDE_VIEW',
    '66',
    '1',
    '70',
    '1',
    '0'
  );

  // Add side view vertices
  points.side.forEach(([x, y]) => {
    dxf.push(
      'VERTEX',
      '8',
      'SIDE_VIEW',
      '10',
      (x + 2 * params.bottomRadius).toString(), // Offset side view
      '20',
      y.toString(),
      '0'
    );
  });

  dxf.push(
    'SEQEND',
    '0',
    'ENDSEC',
    '0',
    'EOF'
  );

  return dxf.join('\n');
}

export function generateEPS(params: ConeParams): string {
  const points = calculatePatternPoints(params);
  const margin = 20;
  
  // Calculate bounding box
  const maxX = Math.max(
    ...points.top.map(([x]) => Math.abs(x)),
    ...points.bottom.map(([x]) => Math.abs(x)),
    ...points.side.map(([x]) => Math.abs(x))
  ) * 2 + margin * 2;
  
  const maxY = Math.max(
    ...points.top.map(([,y]) => Math.abs(y)),
    ...points.bottom.map(([,y]) => Math.abs(y)),
    ...points.side.map(([,y]) => Math.abs(y))
  ) * 2 + margin * 2;

  const eps = [
    '%!PS-Adobe-3.0 EPSF-3.0',
    `%%BoundingBox: 0 0 ${maxX} ${maxY}`,
    '%%BeginProlog',
    '/mm { 2.834646 mul } def',
    '%%EndProlog',
    '',
    '0.5 setlinewidth',
    'newpath',
    `${maxX/4} ${maxY/2} translate`, // Center top view
  ];

  // Draw top view pattern
  eps.push(
    `${points.top[0][0]} ${points.top[0][1]} moveto`
  );
  
  points.top.forEach(([x, y]) => {
    eps.push(`${x} ${y} lineto`);
  });
  
  points.bottom.reverse().forEach(([x, y]) => {
    eps.push(`${x} ${y} lineto`);
  });

  eps.push(
    'closepath',
    'stroke',
    '',
    // Move to side view position
    `${maxX*3/4} ${maxY/2} translate`,
  );

  // Draw side view pattern
  eps.push(
    `${points.side[0][0]} ${points.side[0][1]} moveto`
  );
  
  points.side.forEach(([x, y]) => {
    eps.push(`${x} ${y} lineto`);
  });

  eps.push(
    'closepath',
    'stroke',
    '%%EOF'
  );

  return eps.join('\n');
}

export function generateCoordinates(params: ConeParams): string {
  const points = calculatePatternPoints(params);
  
  const metadata = [
    'CONE PATTERN COORDINATES',
    `Top Radius: ${params.topRadius}${params.unit}`,
    `Bottom Radius: ${params.bottomRadius}${params.unit}`,
    `Height: ${params.height}${params.unit}`,
    '',
    'TOP VIEW COORDINATES (X,Y):',
    ''
  ];

  const topViewPoints = points.top.map((p, i) => 
    `TOP_${i}: ${p[0].toFixed(3)},${p[1].toFixed(3)}`
  );

  const bottomViewPoints = points.bottom.map((p, i) => 
    `BOTTOM_${i}: ${p[0].toFixed(3)},${p[1].toFixed(3)}`
  );

  const sideViewPoints = points.side.map((p, i) => 
    `SIDE_${i}: ${p[0].toFixed(3)},${p[1].toFixed(3)}`
  );

  return [
    ...metadata,
    ...topViewPoints,
    '',
    'BOTTOM VIEW COORDINATES (X,Y):',
    '',
    ...bottomViewPoints,
    '',
    'SIDE VIEW COORDINATES (X,Y):',
    '',
    ...sideViewPoints
  ].join('\n');
}