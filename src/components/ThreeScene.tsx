import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

const Scene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const { viewport } = useThree();
  
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      map: rawMap,
      transparent: true,
      opacity: 0.8,
    });
    return mat;
  }, [rawMap]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} material={material} scale={[viewport.width * 0.3, viewport.height * 0.3, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
};

export const ThreeScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene />
      </Canvas>
    </div>
  );
};