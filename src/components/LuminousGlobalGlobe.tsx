import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Globe, Sparkles, Navigation, Layers, Compass, Radio, Users, BookOpen, Heart, ArrowUpRight } from 'lucide-react';
import { NavigationPage } from '../types';

interface GlobalHub {
  id: string;
  nameAr: string;
  nameEn: string;
  country: string;
  lat: number;
  lon: number;
  studentsCount: number;
  huffazCount: number;
  languages: string[];
  activeProjects: string[];
  isSpiritualCenter?: boolean;
}

const GLOBAL_HUBS: GlobalHub[] = [
  {
    id: 'makkah',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah Al-Mukarramah',
    country: 'المملكة العربية السعودية',
    lat: 21.4225,
    lon: 39.8262,
    studentsCount: 38500,
    huffazCount: 4200,
    languages: ['العربية', 'English', 'Français', 'Urdu'],
    activeProjects: ['إذاعة الحرم المكي 24/7', 'المقرأة الدولية المباشرة', 'طباعة المصاحف العالمية'],
    isSpiritualCenter: true,
  },
  {
    id: 'madinah',
    nameAr: 'المدينة المنورة',
    nameEn: 'Madinah Al-Munawwarah',
    country: 'المملكة العربية السعودية',
    lat: 24.4672,
    lon: 39.6111,
    studentsCount: 29400,
    huffazCount: 3100,
    languages: ['العربية', 'English', 'Türkçe', 'Bahasa'],
    activeProjects: ['معهد إجازات السنة النبوية', 'مركز أسانيد القراءات العشر'],
  },
  {
    id: 'cairo',
    nameAr: 'القاهرة',
    nameEn: 'Cairo',
    country: 'مصر',
    lat: 30.0444,
    lon: 31.2357,
    studentsCount: 41200,
    huffazCount: 4800,
    languages: ['العربية', 'English'],
    activeProjects: ['مجمع المخطوطات واللغة العربية', 'أكاديمية الفقه وأصوله'],
  },
  {
    id: 'khartoum',
    nameAr: 'الخرطوم',
    nameEn: 'Khartoum',
    country: 'السودان',
    lat: 15.5007,
    lon: 32.5599,
    studentsCount: 32800,
    huffazCount: 3600,
    languages: ['العربية', 'العامية السودانية', 'English'],
    activeProjects: ['رعاية خلاوي القرآن الكريم', 'كفالة الأيتام والرعاية الإنسانية', 'استوديو الصوت الدعوي'],
  },
  {
    id: 'istanbul',
    nameAr: 'إسطنبول',
    nameEn: 'Istanbul',
    country: 'تركيا',
    lat: 41.0082,
    lon: 28.9784,
    studentsCount: 18400,
    huffazCount: 1650,
    languages: ['Türkçe', 'العربية', 'English'],
    activeProjects: ['تحقيق المخطوطات العثمانية', 'الترجمة التركية المعتمدة'],
  },
  {
    id: 'kuala_lumpur',
    nameAr: 'كوالالمبور',
    nameEn: 'Kuala Lumpur',
    country: 'ماليزيا',
    lat: 3.1390,
    lon: 101.6869,
    studentsCount: 22600,
    huffazCount: 2100,
    languages: ['Bahasa Melayu', 'English', 'العربية'],
    activeProjects: ['بوابة التقنية الإسلامية والذكاء الاصطناعي', 'مركز دعوة جنوب شرق آسيا'],
  },
  {
    id: 'jakarta',
    nameAr: 'جاكرتا',
    nameEn: 'Jakarta',
    country: 'إندونيسيا',
    lat: -6.2088,
    lon: 106.8456,
    studentsCount: 49500,
    huffazCount: 5200,
    languages: ['Bahasa Indonesia', 'العربية', 'English'],
    activeProjects: ['أكبر شبكة حلقات تحفيظ رقمية', 'ترجمة التفسير الميسر بالإندونيسية'],
  },
  {
    id: 'london',
    nameAr: 'لندن',
    nameEn: 'London',
    country: 'المملكة المتحدة',
    lat: 51.5074,
    lon: -0.1278,
    studentsCount: 14200,
    huffazCount: 980,
    languages: ['English', 'العربية'],
    activeProjects: ['مركز سفير النور في أوروبا', 'ترجمات معاني القرآن بالإنجليزية الحديثة'],
  },
  {
    id: 'new_york',
    nameAr: 'نيويورك',
    nameEn: 'New York',
    country: 'الولايات المتحدة الأمريكية',
    lat: 40.7128,
    lon: -74.0060,
    studentsCount: 11800,
    huffazCount: 820,
    languages: ['English', 'Español'],
    activeProjects: ['بوابة المهتدين الجدد في الأمريكتين', 'حوار الحضارات والتعريف بالإسلام'],
  },
  {
    id: 'abuja',
    nameAr: 'أبوجا / غرب أفريقيا',
    nameEn: 'Abuja / West Africa',
    country: 'نيجيريا',
    lat: 9.0765,
    lon: 7.3986,
    studentsCount: 27900,
    huffazCount: 3400,
    languages: ['Hausa', 'Yoruba', 'English', 'العربية'],
    activeProjects: ['كفالة طلبة العلم الأفارقة', 'مشاريع سقيا الماء الوقفية'],
  },
  {
    id: 'tashkent',
    nameAr: 'طشقند وسمرقند',
    nameEn: 'Tashkent & Samarkand',
    country: 'أوزبكستان',
    lat: 41.2995,
    lon: 69.2401,
    studentsCount: 15300,
    huffazCount: 1400,
    languages: ['Oʻzbekcha', 'Русский', 'العربية'],
    activeProjects: ['تراث الإمام البخاري وأئمة الحديث', 'إحياء المدارس الوقفية التاريخية'],
  },
  {
    id: 'tokyo',
    nameAr: 'طوكيو',
    nameEn: 'Tokyo',
    country: 'اليابان',
    lat: 35.6762,
    lon: 139.6503,
    studentsCount: 4200,
    huffazCount: 180,
    languages: ['日本語 (Japanese)', 'English'],
    activeProjects: ['ترجمة القرآن باللغة اليابانية المعتمدة', 'سفير النور لشرق آسيا'],
  },
  {
    id: 'rabat',
    nameAr: 'الرباط وفاس',
    nameEn: 'Rabat & Fez',
    country: 'المغرب',
    lat: 34.0209,
    lon: -6.8416,
    studentsCount: 21500,
    huffazCount: 2800,
    languages: ['العربية', 'Français', 'Tamazight'],
    activeProjects: ['مقرأة رواية ورش عن نافع', 'وقف كرسي علوم المذهب المالكي'],
  }
];

interface LuminousGlobalGlobeProps {
  onNavigate: (page: NavigationPage) => void;
}

export const LuminousGlobalGlobe: React.FC<LuminousGlobalGlobeProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Interactive 3D Sphere rotation angles (Euler radians)
  const rotationRef = useRef({ phi: 0.35, theta: -0.65 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const [selectedHub, setSelectedHub] = useState<GlobalHub>(GLOBAL_HUBS[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Pre-calculate 3D Cartesians on unit sphere
  const hubVectors = useMemo(() => {
    return GLOBAL_HUBS.map(hub => {
      const latRad = (hub.lat * Math.PI) / 180;
      const lonRad = (hub.lon * Math.PI) / 180;
      return {
        ...hub,
        x: Math.cos(latRad) * Math.sin(lonRad),
        y: -Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lonRad),
      };
    });
  }, []);

  // Background random celestial stars
  const celestialStars = useMemo(() => {
    const list: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 90; i++) {
      list.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.002 + 0.001,
      });
    }
    return list;
  }, []);

  // Generate continent dot grid points for realistic earth topology
  const earthDotGrid = useMemo(() => {
    const dots: { lat: number; lon: number; density: number }[] = [];
    // Fibonacci sphere sampling with terrestrial filter
    const samples = 480;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = (theta % (2 * Math.PI)) * (180 / Math.PI) - 180;
      
      // Rough landmass inclusion filter for Africa, Eurasia, Americas, Australia
      const isLand = 
        (lat > -35 && lat < 38 && lon > -18 && lon < 52) || // Africa
        (lat > 12 && lat < 72 && lon > -10 && lon < 145) || // Eurasia
        (lat > -55 && lat < 70 && lon > -165 && lon < -35) || // Americas
        (lat > -45 && lat < -10 && lon > 110 && lon < 155); // Australia

      if (isLand) {
        dots.push({ lat, lon, density: Math.random() * 0.4 + 0.6 });
      }
    }
    return dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particlePulse = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.40;

      ctx.clearRect(0, 0, width, height);

      // Auto rotation if not dragged
      if (isAutoRotating && !isDraggingRef.current) {
        rotationRef.current.theta += 0.004;
      }
      particlePulse = (particlePulse + 0.015) % 1;

      const { phi, theta } = rotationRef.current;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      // Transform 3D unit point to 2.5D screen coordinates
      const projectPoint = (x: number, y: number, z: number) => {
        // Rotate around Y (theta)
        const x1 = x * cosTheta + z * sinTheta;
        const z1 = -x * sinTheta + z * cosTheta;
        // Rotate around X (phi)
        const y2 = y * cosPhi - z1 * sinPhi;
        const z2 = y * sinPhi + z1 * cosPhi;
        return {
          sx: cx + x1 * radius,
          sy: cy + y2 * radius,
          visible: z2 > 0,
          depth: z2,
        };
      };

      // 1. Draw Atmospheric Deep Space Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.35);
      glowGrad.addColorStop(0, 'rgba(11, 19, 43, 0.95)');
      glowGrad.addColorStop(0.5, 'rgba(7, 13, 30, 0.85)');
      glowGrad.addColorStop(0.85, 'rgba(212, 175, 55, 0.08)');
      glowGrad.addColorStop(1, 'rgba(7, 13, 30, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Globe Base Sphere Silhouette & Night Gradient
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.35,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, '#101B38');
      sphereGrad.addColorStop(0.5, '#0B132B');
      sphereGrad.addColorStop(0.9, '#070D1E');
      sphereGrad.addColorStop(1, '#040711');
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Latitude & Longitude Luminous Wireframe rings
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
      ctx.lineWidth = 1;

      // Draw latitude circles
      for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
        ctx.beginPath();
        let first = true;
        for (let lonDeg = 0; lonDeg <= 360; lonDeg += 10) {
          const latR = (latDeg * Math.PI) / 180;
          const lonR = (lonDeg * Math.PI) / 180;
          const x = Math.cos(latR) * Math.sin(lonR);
          const y = -Math.sin(latR);
          const z = Math.cos(latR) * Math.cos(lonR);
          const p = projectPoint(x, y, z);
          if (first) {
            ctx.moveTo(p.sx, p.sy);
            first = false;
          } else {
            ctx.lineTo(p.sx, p.sy);
          }
        }
        ctx.stroke();
      }

      // Draw Earth topology dots
      earthDotGrid.forEach(dot => {
        const latR = (dot.lat * Math.PI) / 180;
        const lonR = (dot.lon * Math.PI) / 180;
        const x = Math.cos(latR) * Math.sin(lonR);
        const y = -Math.sin(latR);
        const z = Math.cos(latR) * Math.cos(lonR);
        const p = projectPoint(x, y, z);
        if (p.visible) {
          const alpha = Math.max(0.1, p.depth * 0.65 * dot.density);
          ctx.fillStyle = `rgba(229, 192, 123, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 1.2 * p.depth, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Draw Connecting Arcs from Makkah to all Global Hubs
      const makkah = hubVectors.find(h => h.id === 'makkah');
      if (makkah) {
        const pMakkah = projectPoint(makkah.x, makkah.y, makkah.z);

        hubVectors.forEach(hub => {
          if (hub.id === 'makkah') return;
          const pDest = projectPoint(hub.x, hub.y, hub.z);

          // Only draw arc if at least one endpoint or intermediate path faces camera
          if (pMakkah.visible || pDest.visible) {
            // Compute great circle / midpoint elevated above earth surface
            const mx = (makkah.x + hub.x) * 0.5;
            const my = (makkah.y + hub.y) * 0.5;
            const mz = (makkah.z + hub.z) * 0.5;
            const mLen = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
            const arcAltitude = 1.28; // Arc rises above globe
            const controlPoint = projectPoint(
              (mx / mLen) * arcAltitude,
              (my / mLen) * arcAltitude,
              (mz / mLen) * arcAltitude
            );

            // Arc line
            const arcAlpha = Math.min(pMakkah.depth, pDest.depth);
            const isTarget = selectedHub.id === hub.id;
            
            ctx.beginPath();
            ctx.moveTo(pMakkah.sx, pMakkah.sy);
            ctx.quadraticCurveTo(controlPoint.sx, controlPoint.sy, pDest.sx, pDest.sy);
            ctx.strokeStyle = isTarget 
              ? 'rgba(245, 158, 11, 0.95)' 
              : 'rgba(212, 175, 55, 0.35)';
            ctx.lineWidth = isTarget ? 2.2 : 1.2;
            ctx.stroke();

            // Traveling light particle along the arc
            const t = (particlePulse + (hub.studentsCount % 100) / 100) % 1;
            const u = 1 - t;
            const px = u * u * pMakkah.sx + 2 * u * t * controlPoint.sx + t * t * pDest.sx;
            const py = u * u * pMakkah.sy + 2 * u * t * controlPoint.sy + t * t * pDest.sy;

            ctx.fillStyle = isTarget ? '#FFF1CA' : '#F59E0B';
            ctx.shadowColor = '#F59E0B';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px, py, isTarget ? 3.5 : 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      ctx.restore(); // Restore clip

      // 4. Draw Outer Atmospheric Rim & Glowing Corona
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 5. Draw Hub Pins & Luminous Markers (Sorted by depth)
      const sortedHubs = [...hubVectors]
        .map(h => ({ ...h, proj: projectPoint(h.x, h.y, h.z) }))
        .sort((a, b) => a.proj.depth - b.proj.depth);

      sortedHubs.forEach(hub => {
        const { sx, sy, visible, depth } = hub.proj;
        if (!visible) return;

        const isMakkah = hub.isSpiritualCenter;
        const isSelected = selectedHub.id === hub.id;
        const pinRadius = isMakkah ? 6.5 : (isSelected ? 5.5 : 3.5);

        // Pulsing radar ripple for selected hub or Makkah
        if (isMakkah || isSelected) {
          const rippleRadius = pinRadius + (particlePulse * 18);
          const rippleAlpha = Math.max(0, 1 - particlePulse);
          ctx.beginPath();
          ctx.arc(sx, sy, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isMakkah 
            ? `rgba(245, 158, 11, ${rippleAlpha * 0.8})` 
            : `rgba(56, 189, 248, ${rippleAlpha * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Pin Core
        ctx.beginPath();
        ctx.arc(sx, sy, pinRadius, 0, Math.PI * 2);
        ctx.fillStyle = isMakkah ? '#F59E0B' : (isSelected ? '#38BDF8' : '#D4AF37');
        ctx.shadowColor = isMakkah ? '#F59E0B' : '#38BDF8';
        ctx.shadowBlur = isMakkah || isSelected ? 12 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pin Inner White Center
        ctx.beginPath();
        ctx.arc(sx, sy, pinRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // City Label in Arabic
        if (depth > 0.35 || isSelected || isMakkah) {
          ctx.font = `${isMakkah || isSelected ? 'bold 11px' : '9px'} 'Cairo', sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = isMakkah 
            ? '#FFF1CA' 
            : (isSelected ? '#BAE6FD' : 'rgba(248, 250, 252, 0.85)');
          ctx.fillText(hub.nameAr, sx, sy - pinRadius - 5);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isAutoRotating, selectedHub, hubVectors, earthDotGrid]);

  // Handle Resize smoothly
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(rect.width, 540);
      canvasRef.current.width = size * dpr;
      canvasRef.current.height = size * dpr;
      canvasRef.current.style.width = `${size}px`;
      canvasRef.current.style.height = `${size}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer Drag Handlers (Touch & Mouse unified)
  const onPointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: clientX, y: clientY };
  };

  const onPointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - prevMouseRef.current.x;
    const dy = clientY - prevMouseRef.current.y;
    rotationRef.current.theta += dx * 0.007;
    rotationRef.current.phi = Math.max(-1.2, Math.min(1.2, rotationRef.current.phi + dy * 0.007));
    prevMouseRef.current = { x: clientX, y: clientY };
  };

  const onPointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#070D1E] via-[#0B132B] to-[#040814] border border-[#D4AF37]/30 shadow-2xl p-6 sm:p-10 text-white">
      {/* Background Starry Glow & Celestial Lattice */}
      <div className="absolute inset-0 bg-noor-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive 3D Luminous Globe (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          
          <div className="relative" ref={containerRef}>
            <canvas
              ref={canvasRef}
              className="cursor-grab active:cursor-grabbing touch-none select-none"
              onMouseDown={(e) => onPointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => onPointerMove(e.clientX, e.clientY)}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={(e) => onPointerDown(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => onPointerMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={onPointerUp}
              title="اسحب لتدوير الكرة الأرضية ثلاثية الأبعاد واكتشاف المراكز العالمية"
            />

            {/* Floating Top Indicator */}
            <div className="absolute top-2 right-2 bg-[#0B132B]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/30 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#F3E8CB] font-bold">140 دولة متصلة بالنور</span>
            </div>

            {/* Quick Interactive Controls */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className="px-3 py-1 rounded-full bg-[#0B132B]/80 hover:bg-[#1E293B] border border-white/10 text-[11px] text-slate-300 font-medium transition"
              >
                {isAutoRotating ? 'إيقاف الدوران' : 'تفعيل الدوران'}
              </button>
              <button
                onClick={() => {
                  rotationRef.current = { phi: 0.35, theta: -0.65 };
                  setSelectedHub(GLOBAL_HUBS[0]);
                }}
                className="px-3 py-1 rounded-full bg-[#0B132B]/80 hover:bg-[#1E293B] border border-[#D4AF37]/30 text-[11px] text-[#D4AF37] font-medium transition"
              >
                العودة لمكة 🕋
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 text-center">
            اسحب لتوجيه الكرة الأرضية واستكشاف مسارات نشر هداية القرآن حول القارات
          </p>
        </div>

        {/* Right Column: Live Hub Telemetry & Hub Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E8CB] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>شبكة النور العالمية • Global Noor Network</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black font-amiri text-white leading-tight">
              رسالة الإسلام هدايةٌ تنير أرجاء المعمورة
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              انطلاقاً من مهبط الوحي بمكة المكرمة، تمتد حلقات المقارئ والتعليم والترجمات المعتمدة إلى أكثر من 140 دولة على مدار الساعة.
            </p>
          </div>

          {/* Active Hub Telemetry Card */}
          <div className="p-5 rounded-2xl bg-[#0F172A]/90 border border-[#D4AF37]/40 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-[#D4AF37] font-bold block uppercase tracking-wider">
                  {selectedHub.isSpiritualCenter ? '★ مهبط الوحي والقبلة المشرفة' : 'مركز إقليمي متصل'}
                </span>
                <h3 className="text-xl font-bold font-amiri text-white flex items-center gap-2">
                  <span>{selectedHub.nameAr}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">({selectedHub.nameEn})</span>
                </h3>
              </div>
              
              <div className="text-right">
                <span className="text-xs text-slate-300 block">{selectedHub.country}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">نشط ومتصل الآن</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0B132B] border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#38BDF8]" />
                  <span>الطلاب والمستفيدون</span>
                </span>
                <span className="text-base font-black font-mono text-white">
                  +{selectedHub.studentsCount.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0B132B] border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#D4AF37]" />
                  <span>الحفاظ المجازون</span>
                </span>
                <span className="text-base font-black font-mono text-[#D4AF37]">
                  +{selectedHub.huffazCount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Languages Supported */}
            <div className="space-y-1 text-xs">
              <span className="text-[11px] text-slate-400 font-bold">اللغات المعتمدة في هذا المركز:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedHub.languages.map((l, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-[#1E293B] text-[10px] text-[#F3E8CB] font-medium border border-white/5">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div className="space-y-1 text-xs">
              <span className="text-[11px] text-slate-400 font-bold">أبرز البرامج الجارية:</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {selectedHub.activeProjects.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Hub Selector Ribbon */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-bold block">
              اختر مركزاً للاستعراض السريع على الكرة الأرضية:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {GLOBAL_HUBS.map(hub => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    onClick={() => {
                      setSelectedHub(hub);
                      // Turn globe toward selected hub
                      const latRad = (hub.lat * Math.PI) / 180;
                      const lonRad = (hub.lon * Math.PI) / 180;
                      rotationRef.current.phi = latRad * 0.8;
                      rotationRef.current.theta = -lonRad + Math.PI / 2;
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                      isSelected
                        ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37] shadow-md'
                        : 'bg-[#0B132B]/80 text-slate-300 border-white/10 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {hub.isSpiritualCenter && '🕋 '}
                    {hub.nameAr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct CTA */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('quran')}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#E5C07B] hover:to-[#D4AF37] text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>الانضمام للمقارئ العالمية</span>
            </button>
            <button
              onClick={() => onNavigate('noorAmbassador')}
              className="px-4 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#D4AF37]/40 text-[#F3E8CB] font-bold text-xs transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>كن سفير النور</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
