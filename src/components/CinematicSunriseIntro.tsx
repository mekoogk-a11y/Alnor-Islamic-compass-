import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Sparkles, Sun, Eye, SkipForward, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';
import { OFFICIAL_COMPLEX_LOGO } from '../data/islamicData';
import { useLanguage } from '../context/LanguageContext';

interface CinematicSunriseIntroProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const CinematicSunriseIntro: React.FC<CinematicSunriseIntroProps> = ({ 
  onComplete, 
  forceShow = false 
}) => {
  const { lang, isRtl } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // State
  const [phase, setPhase] = useState<'night' | 'fajr' | 'sunrise' | 'logo' | 'complete'>('night');
  const [progress, setProgress] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Animation frame & timer references for clean disposal
  const reqIdRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Complete and remember in sessionStorage
  const handleFinish = useCallback(() => {
    try {
      sessionStorage.setItem('alnoor_sunrise_intro_shown', 'true');
    } catch (_) {}
    setPhase('complete');
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  // Gentle ambient acoustic chime for sunrise (Web Audio API)
  const playSunriseAtmosphere = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const now = ctx.currentTime;
      // Majestic celestial harmonic triad: E4, G#4, B4, E5 (Solar illumination chord)
      const freqs = [329.63, 415.30, 493.88, 659.25, 987.77];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.0001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.03, now + i * 0.12 + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 4.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 4.6);
      });
    } catch (_) {}
  }, []);

  // Keyboard shortcut: ESC skips intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Three.js WebGL Cinematic Scene Implementation
  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && !forceShow) {
      handleFinish();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x050814, 0.04);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

    // 3. Renderer Setup with High-Efficiency Flags
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      rendererRef.current = renderer;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
    } catch (err) {
      console.warn('WebGL init notice:', err);
      setIsWebGLSupported(false);
      return;
    }

    // 4. Starfield Generation (Deep Space Cosmic Milieu)
    const starsCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    const colorA = new THREE.Color(0xFDE047); // Golden yellow
    const colorB = new THREE.Color(0xBAE6FD); // Crystal cyan
    const colorC = new THREE.Color(0xFFFFFF); // White

    for (let i = 0; i < starsCount; i++) {
      const idx = i * 3;
      // Spherical distribution around outer shell
      const radius = 40 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? colorA : (Math.random() > 0.3 ? colorB : colorC);
      starColors[idx] = chosenColor.r;
      starColors[idx + 1] = chosenColor.g;
      starColors[idx + 2] = chosenColor.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Earth Sphere Creation (Procedural High-Detail Map Texture Canvas)
    const earthRadius = 2.0;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);

    // Generate high-resolution procedural continent & ocean texture
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext('2d')!;

    // Deep nocturnal ocean background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#040b18');
    oceanGrad.addColorStop(0.5, '#07162e');
    oceanGrad.addColorStop(1, '#040b18');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Continents & Golden Lights Glow
    ctx.fillStyle = '#1e382b'; // Forest-emerald landmass
    // Africa, Europe, Middle East, Asia outlines
    ctx.beginPath();
    // Africa & Middle East
    ctx.arc(500, 260, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    // Eurasia
    ctx.ellipse(620, 180, 160, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    // Americas
    ctx.beginPath();
    ctx.ellipse(240, 240, 95, 140, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Light Beacon at Makkah / Middle East Coordinates
    const makkahX = 550;
    const makkahY = 220;
    const beaconGrad = ctx.createRadialGradient(makkahX, makkahY, 2, makkahX, makkahY, 45);
    beaconGrad.addColorStop(0, '#FFFBEB');
    beaconGrad.addColorStop(0.3, '#FDE047');
    beaconGrad.addColorStop(0.7, '#D97706');
    beaconGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = beaconGrad;
    ctx.beginPath();
    ctx.arc(makkahX, makkahY, 45, 0, Math.PI * 2);
    ctx.fill();

    const earthTexture = new THREE.CanvasTexture(textureCanvas);
    earthTexture.colorSpace = THREE.SRGBColorSpace;

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.55,
      metalness: 0.15,
      bumpScale: 0.05,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.rotation.y = 0.8;
    scene.add(earthMesh);

    // 6. Atmospheric Glow Layer (Luminous Rim Atmosphere)
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.055, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uColorNight;
        uniform vec3 uColorDawn;
        uniform vec3 uColorSun;
        uniform float uSunProgress;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          vec3 atmosphereColor = mix(uColorNight, uColorDawn, clamp(uSunProgress * 1.8, 0.0, 1.0));
          atmosphereColor = mix(atmosphereColor, uColorSun, clamp((uSunProgress - 0.45) * 2.0, 0.0, 1.0));
          gl_FragColor = vec4(atmosphereColor, intensity * 0.95);
        }
      `,
      uniforms: {
        uColorNight: { value: new THREE.Color(0x1E3A8A) }, // Deep royal blue
        uColorDawn: { value: new THREE.Color(0xF59E0B) },  // Warm amber dawn
        uColorSun: { value: new THREE.Color(0xFEF08A) },   // Brilliant solar light
        uSunProgress: { value: 0.0 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 7. Celestial Lighting (Rising Sun)
    const ambientLight = new THREE.AmbientLight(0x0A1428, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFDF8E2, 0.1);
    sunLight.position.set(-8, -2, -6);
    scene.add(sunLight);

    // Sun Corona & Flare Sprite (Glow Sprite that rises behind Earth's edge)
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256;
    flareCanvas.height = 256;
    const fCtx = flareCanvas.getContext('2d')!;
    const flareGrad = fCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    flareGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    flareGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.9)');
    flareGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)');
    flareGrad.addColorStop(0.8, 'rgba(217, 119, 6, 0.15)');
    flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    fCtx.fillStyle = flareGrad;
    fCtx.fillRect(0, 0, 256, 256);

    const flareTexture = new THREE.CanvasTexture(flareCanvas);
    const flareMaterial = new THREE.SpriteMaterial({
      map: flareTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0,
    });
    const sunSprite = new THREE.Sprite(flareMaterial);
    sunSprite.scale.set(4.5, 4.5, 1);
    sunSprite.position.set(-2.6, 0.6, -3);
    scene.add(sunSprite);

    // 8. Animation & Timeline State
    const startTime = performance.now();
    const DURATION = 6200; // 6.2 seconds complete majestic journey

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(1, elapsed / DURATION);
      setProgress(progressRatio);

      // Rotate Earth slowly
      earthMesh.rotation.y += 0.0018;
      starField.rotation.y -= 0.0003;

      // Phase transitions
      if (progressRatio < 0.25) {
        setPhase('night');
        // Sun starts rising from below horizon
        sunLight.position.set(-6 + progressRatio * 8, -2 + progressRatio * 7, -4 + progressRatio * 5);
        sunLight.intensity = 0.2 + progressRatio * 2.5;
        sunSprite.material.opacity = progressRatio * 2.2;
        atmosphereMaterial.uniforms.uSunProgress.value = progressRatio * 1.5;
        ambientLight.intensity = 0.35 + progressRatio * 0.4;
      } else if (progressRatio < 0.55) {
        setPhase('fajr');
        const pSub = (progressRatio - 0.25) / 0.3;
        sunLight.position.set(-4 + pSub * 8, 1 + pSub * 4, -2 + pSub * 4);
        sunLight.intensity = 1.0 + pSub * 3.5;
        sunLight.color.setHex(0xFFEDD5); // Dawn rose-gold
        sunSprite.material.opacity = Math.min(1, 0.6 + pSub * 0.6);
        sunSprite.scale.set(5.5 + pSub * 4.5, 5.5 + pSub * 4.5, 1);
        atmosphereMaterial.uniforms.uSunProgress.value = 0.4 + pSub * 0.4;
        ambientLight.intensity = 0.5 + pSub * 0.8;
      } else if (progressRatio < 0.82) {
        setPhase('sunrise');
        const pSub = (progressRatio - 0.55) / 0.27;
        // Sun reaches apex and daylight floods Earth
        sunLight.intensity = 4.5 + pSub * 2.5;
        sunLight.color.setHex(0xFFFFFF); // Brilliant daylight
        sunSprite.scale.set(10 + pSub * 6, 10 + pSub * 6, 1);
        atmosphereMaterial.uniforms.uSunProgress.value = 0.8 + pSub * 0.2;
        ambientLight.intensity = 1.3 + pSub * 0.7;

        // Smooth camera zoom towards Earth's spiritual horizon
        camera.position.z = 7.8 - Math.pow(pSub, 1.8) * 3.8;
        camera.position.y = pSub * 0.6;
      } else {
        setPhase('logo');
      }

      // Finish when complete
      if (progressRatio >= 1) {
        handleFinish();
        return;
      }

      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(animate);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    // Window Resize Handler
    const handleResize = () => {
      if (!renderer || !canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup and Dispose All Geometries & Materials
    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (_) {}
      }

      // Explicit Three.js disposal
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthTexture.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      flareTexture.dispose();
      flareMaterial.dispose();
      renderer.dispose();
    };
  }, [forceShow, handleFinish]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 overflow-hidden bg-[#050814] transition-opacity duration-700 select-none ${
        phase === 'complete' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label="مشهد شروق النور الافتتاحي"
    >
      {/* Three.js WebGL Canvas */}
      {isWebGLSupported ? (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover block"
        />
      ) : (
        // High-Quality Fallback for low-spec/non-WebGL devices
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#050814] via-[#0B1536] to-[#0A1A40]">
          <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/20 via-sky-500/30 to-yellow-400/20 blur-3xl animate-pulse" />
        </div>
      )}

      {/* Radiant Solar Lens Flare Overlay during Sunrise */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          phase === 'sunrise' || phase === 'logo' ? 'opacity-80' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at 45% 40%, rgba(254, 240, 138, 0.45) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 75%)',
        }}
      />

      {/* Top Floating Controls Bar: Skip Intro & Audio Atmosphere */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
        
        {/* Subtle Institutional Slogan Tag */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B132B]/80 backdrop-blur-md border border-[#D4AF37]/40 shadow-lg text-xs font-bold text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span className="font-amiri tracking-wider">NOOR GLOBAL · شروق نور الإسلام للعالمين</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Audio Chime Trigger */}
          <button
            onClick={() => {
              playSunriseAtmosphere();
              setIsAudioEnabled(!isAudioEnabled);
            }}
            className="p-2.5 rounded-full bg-[#0B132B]/80 hover:bg-[#111C3D] border border-amber-400/40 text-amber-300 transition-all cursor-pointer shadow-md hover:scale-105"
            title={isAudioEnabled ? 'كتم النغمات' : 'تشغيل النغمة السماوية'}
            aria-label="التحكم بالصوت"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-75" />}
          </button>

          {/* Skip Intro Button (زر تخطي المقدمة) */}
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 hover:from-amber-500/40 hover:to-amber-400/50 text-yellow-200 border border-amber-400/60 backdrop-blur-md text-xs font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="تخطي المقدمة والدخول الفوري للموقع"
          >
            <span>{lang === 'ar' ? 'تخطي المقدمة' : 'Skip Intro'}</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Central Climax: Logo Reveal in Pure White & Golden Light */}
      <div 
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center pointer-events-none transition-all duration-1000 ${
          phase === 'logo' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Glowing Aura Behind Official Logo */}
        <div className="relative">
          <div className="absolute -inset-10 bg-gradient-to-r from-amber-400/50 via-yellow-300/60 to-amber-500/50 rounded-full blur-3xl animate-pulse" />

          {/* Official Emblem Logo */}
          <div className="relative p-4 sm:p-6 bg-[#070D1E]/90 rounded-3xl border-2 border-amber-400 shadow-[0_0_60px_rgba(212,175,55,0.7)] backdrop-blur-2xl">
            <img 
              src={OFFICIAL_COMPLEX_LOGO} 
              alt="شعار مجمع النور الإسلامي العالمي" 
              className="w-56 sm:w-80 md:w-96 max-w-full h-auto object-contain filter drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>

        {/* Institutional Identity Title & Quranic Vision */}
        <div className="mt-6 space-y-2 max-w-xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#111C3D]/90 border border-amber-400/50 text-xs text-amber-300 font-bold shadow-lg">
            <Sun className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
            <span>نورٌ يعم الآفاق وهدايةٌ تمتد لكل الشعوب</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black font-amiri text-white tracking-wide leading-snug drop-shadow-md">
            «القرآن هداية، والعلم بناء، والعمل الخيري عطاء»
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
            NOOR GLOBAL · A WORLD OF LIGHT
          </p>
        </div>
      </div>

      {/* Bottom Cinematic Progress Track */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col items-center gap-2 pointer-events-none">
        
        {/* Phase Indicator Label */}
        <span className="text-[11px] font-mono font-bold tracking-widest text-amber-300/80 uppercase">
          {phase === 'night' && 'الفضاء الكوني والكرة الأرضية · Space & Earth'}
          {phase === 'fajr' && 'بزوغ الفجر والشفق الذهبي · Dawn Horizon'}
          {phase === 'sunrise' && 'شروق النور والنهار الساطع · Solar Illumination'}
          {phase === 'logo' && 'مجمع النور الإسلامي العالمي · Al-Noor Global'}
        </span>

        {/* Progress Bar Line */}
        <div className="w-48 sm:w-64 h-1 bg-slate-800/80 rounded-full overflow-hidden border border-amber-400/20">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 transition-all duration-150 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <span className="text-[10px] text-slate-400">
          {lang === 'ar' ? 'اضغط ESC أو زر التخطي للدخول الفوري' : 'Press ESC or Skip to enter immediately'}
        </span>
      </div>

    </div>
  );
};
