'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

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
      
      float mx_cell_noise_float(vec2 p) {
        float a = dot(p, vec2(127.1, 311.7));
        return fract(sin(a) * 43758.5453123);
      }
      
      void main() {
        vec4 depthColor = texture2D(uDepthMap, vUv);
        vec2 distortedUv = vUv + depthColor.r * uPointer * 0.01;
        vec4 color = texture2D(uTexture, distortedUv);
        
        vec2 aspect = vec2(${WIDTH}.0 / ${HEIGHT}.0, 1.0);
        vec2 tUv = vec2(vUv.x * aspect.x, vUv.y);
        
        vec2 tiling = vec2(120.0);
        vec2 tiledUv = mod(tUv * tiling, 2.0) - 1.0;
        
        float brightness = mx_cell_noise_float(tUv * tiling / 2.0);
        
        float dist = length(tiledUv);
        float dot = smoothstep(0.5, 0.49, dist) * brightness;
        
        float flow = 1.0 - smoothstep(0.0, 0.02, abs(depthColor.r - uProgress));
        
        vec3 mask = dot * flow * vec3(10.0, 0.0, 0.0);
        
        vec3 final = color.rgb + mask;
        
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

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value.set(pointer.x, pointer.y);
  });

  const scaleFactor = 0.3;
  return (
    <mesh scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export const HeroScene = () => {
  const titleWords = 'Onerverse'.split(' ');
  const subtitle = 'Experience the convergence of innovation and imagination in a digital universe beyond boundaries';
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
    <div className="h-svh bg-black relative">
      <div className="h-svh uppercase items-center w-full absolute z-[60] pointer-events-none px-10 flex justify-center flex-col">
        <div className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold">
          <div className="flex space-x-2 lg:space-x-6 overflow-hidden text-white">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? 'fade-in' : ''}
                style={{ animationDelay: `${index * 0.13 + (delays[index] || 0)}s`, opacity: index < visibleWords ? undefined : 0 }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-2 overflow-hidden text-white font-bold">
          <div
            className={subtitleVisible ? 'fade-in-subtitle' : ''}
            style={{ animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`, opacity: subtitleVisible ? undefined : 0 }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <button
        className="explore-btn absolute bottom-10 left-1/2 transform -translate-x-1/2 z-[50] text-white flex items-center gap-2"
        style={{ animationDelay: '2.2s', pointerEvents: 'auto' }}
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
        flat
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroScene;