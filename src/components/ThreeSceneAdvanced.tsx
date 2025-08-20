import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const { viewport, pointer } = useThree();
  
  const { material, uniforms } = useMemo(() => {
    // Create shader material with red scanning effect
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform sampler2D uDepthMap;
      uniform vec2 uPointer;
      uniform float uProgress;
      varying vec2 vUv;
      
      void main() {
        // Sample depth and texture
        vec4 depth = texture2D(uDepthMap, vUv);
        vec2 distortedUv = vUv + depth.r * uPointer * 0.01;
        vec4 color = texture2D(uTexture, distortedUv);
        
        // Create red scanning line effect
        float scanLine = abs(depth.r - uProgress);
        float flow = 1.0 - smoothstep(0.0, 0.02, scanLine);
        
        // Add red dots grid effect
        vec2 tiledUv = mod(vUv * 120.0, 2.0) - 1.0;
        float dist = length(tiledUv);
        float dot = smoothstep(0.5, 0.49, dist);
        
        // Combine effects
        vec3 redEffect = vec3(10.0, 0.0, 0.0) * dot * flow;
        vec3 finalColor = color.rgb + redEffect;
        
        gl_FragColor = vec4(finalColor, color.a);
      }
    `;

    const uniforms = {
      uTexture: { value: rawMap },
      uDepthMap: { value: depthMap },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uProgress: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true
    });

    return { material, uniforms };
  }, [rawMap, depthMap]);

  useFrame(({ clock, pointer }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    uniforms.uPointer.value.set(pointer.x, pointer.y);
  });

  const scaleFactor = 0.3;
  const [w, h] = useAspect(WIDTH, HEIGHT);

  return (
    <mesh material={material} scale={[w * scaleFactor, h * scaleFactor, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};

// Post processing for bloom effect
const PostProcessing = () => {
  const { gl, scene, camera } = useThree();
  
  useFrame(() => {
    // Add subtle glow effect through CSS instead of WebGPU
  }, 1);

  return null;
};

export const ThreeSceneAdvanced: React.FC = () => {
  const titleWords = 'Onerverse'.split(' ');
  const subtitle = 'Experience the convergence of innovation and imagination';
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <div className="h-screen relative bg-black">
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true }}
      >
        <Scene />
        <PostProcessing />
      </Canvas>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center px-4 max-w-6xl mx-auto">
          <div className="text-5xl md:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold mb-4">
            <div className="flex justify-center space-x-4 lg:space-x-6 overflow-hidden text-white">
              {titleWords.map((word, index) => (
                <div
                  key={index}
                  className={index < visibleWords ? 'fade-in' : ''}
                  style={{ 
                    animationDelay: `${index * 0.13}s`, 
                    opacity: index < visibleWords ? undefined : 0 
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl mt-4 overflow-hidden text-white/90 font-medium">
            <div
              className={subtitleVisible ? 'fade-in-subtitle' : ''}
              style={{ 
                animationDelay: `${titleWords.length * 0.13 + 0.2}s`, 
                opacity: subtitleVisible ? undefined : 0 
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Explore Button */}
      <button
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 glass-button text-white flex items-center gap-2 pointer-events-auto"
        style={{ animationDelay: '2.2s' }}
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Scroll to explore
        <span className="inline-block animate-bounce">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 12L11 17L16 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .fade-in-subtitle {
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};