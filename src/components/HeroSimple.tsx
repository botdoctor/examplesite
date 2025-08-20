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
      
      // Simple noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        // Sample depth and texture with pointer distortion
        vec4 depth = texture2D(uDepthMap, vUv);
        vec2 distortedUv = vUv + depth.r * uPointer * 0.01;
        vec4 color = texture2D(uTexture, distortedUv);
        
        // Create the red dots grid
        vec2 aspect = vec2(${WIDTH}.0 / ${HEIGHT}.0, 1.0);
        vec2 tUv = vec2(vUv.x * aspect.x, vUv.y);
        vec2 tiling = vec2(120.0);
        vec2 tiledUv = mod(tUv * tiling, 2.0) - 1.0;
        
        // Brightness variation using noise
        float brightness = random(floor(tUv * tiling / 2.0));
        
        // Create dots
        float dist = length(tiledUv);
        float dot = smoothstep(0.5, 0.49, dist) * brightness;
        
        // Create scanning flow effect based on depth
        float flow = 1.0 - smoothstep(0.0, 0.02, abs(depth.r - uProgress));
        
        // Red mask effect
        vec3 mask = dot * flow * vec3(10.0, 0.0, 0.0);
        
        // Blend screen effect (approximation)
        vec3 invColor = vec3(1.0) - color.rgb;
        vec3 invMask = vec3(1.0) - mask;
        vec3 final = vec3(1.0) - invColor * invMask;
        
        gl_FragColor = vec4(final, color.a);
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
    <mesh ref={meshRef} material={material} scale={[w * scaleFactor, h * scaleFactor, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};

export const HeroSimple: React.FC = () => {
  const titleWords = 'Onerverse'.split(' ');
  const subtitle = 'Experience the convergence of innovation and imagination.';
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

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
    <div className="h-svh bg-black">
      <div className="h-svh uppercase items-center w-full absolute z-[60] pointer-events-none px-10 flex justify-center flex-col">
        <div className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold">
          <div className="flex space-x-2 lg:space-x-6 overflow-hidden text-white">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? 'fade-in' : ''}
                style={{ 
                  animationDelay: `${index * 0.13 + (delays[index] || 0)}s`, 
                  opacity: index < visibleWords ? undefined : 0 
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-2 overflow-hidden text-white font-bold">
          <div
            className={subtitleVisible ? 'fade-in-subtitle' : ''}
            style={{ 
              animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`, 
              opacity: subtitleVisible ? undefined : 0 
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <button
        className="explore-btn"
        style={{ animationDelay: '2.2s' }}
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Scroll to explore
        <span className="explore-arrow">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-svg">
            <path d="M11 5V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 12L11 17L16 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroSimple;