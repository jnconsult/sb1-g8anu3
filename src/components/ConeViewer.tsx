import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { ConeParams, Language } from '../types';
import { translations } from '../translations';
import { useMemo } from 'react';
import * as THREE from 'three';

interface ConeViewerProps {
  params: ConeParams;
  language: Language;
}

export default function ConeViewer({ params, language }: ConeViewerProps) {
  const geometry = useMemo(() => {
    const { topRadius, bottomRadius, height, topAngle, bottomAngle } = params;
    const scale = 0.001;
    const scaledTopRadius = topRadius * scale;
    const scaledBottomRadius = bottomRadius * scale;
    const scaledHeight = height * scale;

    // Create custom geometry for partial cone
    const segments = 64;
    const vertices = [];
    const indices = [];
    const uvs = [];

    // Calculate angles in radians
    const topRadians = (topAngle * Math.PI) / 180;
    const bottomRadians = (bottomAngle * Math.PI) / 180;

    // Calculate number of segments based on the larger angle
    const maxAngle = Math.max(topAngle, bottomAngle);
    const actualSegments = Math.ceil((segments * maxAngle) / 360);

    // Generate vertices for top and bottom circles
    for (let i = 0; i <= actualSegments; i++) {
      const topTheta = (-topRadians / 2) + (i * topRadians / actualSegments);
      const bottomTheta = (-bottomRadians / 2) + (i * bottomRadians / actualSegments);

      // Top circle vertex
      vertices.push(
        scaledTopRadius * Math.cos(topTheta),
        scaledHeight / 2,
        scaledTopRadius * Math.sin(topTheta)
      );

      // Bottom circle vertex
      vertices.push(
        scaledBottomRadius * Math.cos(bottomTheta),
        -scaledHeight / 2,
        scaledBottomRadius * Math.sin(bottomTheta)
      );

      // UVs
      const u = i / actualSegments;
      uvs.push(u, 1);
      uvs.push(u, 0);
    }

    // Generate faces
    for (let i = 0; i < actualSegments * 2; i += 2) {
      indices.push(i, i + 1, i + 2);
      indices.push(i + 1, i + 3, i + 2);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }, [params]);

  const maxDimension = Math.max(
    params.topRadius,
    params.bottomRadius,
    params.height
  ) * 0.001;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{translations.preview3D[language]}</h2>
      <div className="h-[400px] w-full bg-gray-900 rounded-lg overflow-hidden">
        <Canvas>
          <PerspectiveCamera
            makeDefault
            position={[maxDimension * 2, maxDimension * 1.5, maxDimension * 2]}
            fov={50}
            near={0.01}
            far={1000}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 2, 2]} intensity={1} />
          <group position={[0, 0, 0]}>
            <mesh geometry={geometry}>
              <meshStandardMaterial
                color="#fef08a" // Changed to light yellow (Tailwind yellow-200)
                wireframe={false}
                side={THREE.DoubleSide}
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
            <Grid
              args={[10, 10]}
              cellSize={0.1}
              cellThickness={0.5}
              cellColor="#6b7280"
              sectionSize={1}
              sectionThickness={1}
              sectionColor="#9ca3af"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              position={[0, -maxDimension / 2, 0]}
            />
          </group>
          <OrbitControls
            minDistance={maxDimension}
            maxDistance={maxDimension * 5}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        </Canvas>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {translations.preview3DHelp[language]}
      </p>
    </div>
  );
}