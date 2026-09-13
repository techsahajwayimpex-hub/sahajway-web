"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RefreshCw, MapPin } from "lucide-react";

// Geographic coordinates for HQ
const ANAND_GUJARAT = { lat: 22.56, lon: 72.93, name: "Anand, Gujarat (HQ)" };

export interface DestinationItem {
  _id?: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
}

// Fallback initial trade corridors if none yet in DB
const DEFAULT_DESTINATIONS: DestinationItem[] = [
  { name: "New York, USA", country: "United States", lat: 40.7128, lon: -74.006 },
  { name: "London, UK", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo, Japan", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney, Australia", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Frankfurt, Germany", country: "Germany", lat: 50.1109, lon: 8.6821 },
  { name: "Dubai, UAE", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Rotterdam, Netherlands", country: "Netherlands", lat: 51.9244, lon: 4.4777 },
];

// Translate Lat/Lon to 3D Cartesian coordinates on sphere
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
}

interface GlobeSectionProps {
  destinations?: DestinationItem[];
}

export default function GlobeSection({ destinations }: GlobeSectionProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);

  const [activeDestinations, setActiveDestinations] = useState<DestinationItem[]>(
    destinations && destinations.length > 0 ? destinations : DEFAULT_DESTINATIONS
  );
  const [activeDestination, setActiveDestination] = useState<string>("New York, USA");
  const [loading, setLoading] = useState(true);

  // Sync with prop updates
  useEffect(() => {
    if (destinations && destinations.length > 0) {
      setActiveDestinations(destinations);
      setActiveDestination(destinations[0].name);
    }
  }, [destinations]);

  // Client-side API fetch fallback
  useEffect(() => {
    if (!destinations || destinations.length === 0) {
      let isMounted = true;
      fetch("/api/destinations")
        .then((res) => res.json())
        .then((data: DestinationItem[]) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setActiveDestinations(data);
            setActiveDestination(data[0].name);
          }
        })
        .catch((err) => {
          console.error("Failed to load dynamic destinations from API:", err);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [destinations]);

  // Smooth rotate to destination
  const rotateToDestination = useCallback((destName: string) => {
    setActiveDestination(destName);
    const dest = activeDestinations.find((d) => d.name === destName);
    if (!dest || !globeGroupRef.current) return;

    const targetLon = (dest.lon + 180) * (Math.PI / 180);
    const targetLat = dest.lat * (Math.PI / 180);

    const targetRotY = -targetLon + Math.PI / 2;
    const targetRotX = targetLat * 0.4;

    const startRotY = globeGroupRef.current.rotation.y;
    const startRotX = globeGroupRef.current.rotation.x;
    let progress = 0;

    const animateTransition = () => {
      progress += 0.05;
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          startRotY,
          targetRotY,
          Math.min(progress, 1)
        );
        globeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          startRotX,
          targetRotX,
          Math.min(progress, 1)
        );
      }
      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      }
    };
    animateTransition();
  }, [activeDestinations]);

  useEffect(() => {
    if (!mountRef.current) return;

    setLoading(false);
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.8;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create Globe
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const globeRadius = 2.25;

    // A. Dot-Matrix Fibonacci Point Sphere (Futuristic Tech Aesthetic)
    const dotCount = 2400;
    const dotGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const colors = new Float32Array(dotCount * 3);

    const goldColor = new THREE.Color(0xfde047);
    const cyanColor = new THREE.Color(0x38bdf8);
    const deepBlueColor = new THREE.Color(0x0284c7);

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(1 - (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;

      const x = globeRadius * Math.sin(phi) * Math.cos(theta);
      const y = globeRadius * Math.sin(phi) * Math.sin(theta);
      const z = globeRadius * Math.cos(phi);

      const index = i * 3;
      positions[index] = x;
      positions[index + 1] = y;
      positions[index + 2] = z;

      let dotColor = deepBlueColor;
      if (i % 12 === 0) {
        dotColor = goldColor;
      } else if (i % 3 === 0) {
        dotColor = cyanColor;
      }

      colors[index] = dotColor.r;
      colors[index + 1] = dotColor.g;
      colors[index + 2] = dotColor.b;
    }

    dotGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const dotMaterial = new THREE.PointsMaterial({
      size: 0.048,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const globeDots = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(globeDots);

    // B. Inner Glowing Luminous Core
    const coreGeometry = new THREE.SphereGeometry(globeRadius * 0.98, 36, 36);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0369a1,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // Outer Glow Halo
    const haloGeometry = new THREE.SphereGeometry(globeRadius * 1.06, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    globeGroup.add(haloMesh);

    // C. Plot HQ: Anand, Gujarat (Gold Hub Pin & Pulse)
    const hqPos = latLongToVector3(ANAND_GUJARAT.lat, ANAND_GUJARAT.lon, globeRadius);
    const hqGeometry = new THREE.SphereGeometry(0.08, 20, 20);
    const hqMaterial = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const hqMesh = new THREE.Mesh(hqGeometry, hqMaterial);
    hqMesh.position.copy(hqPos);
    globeGroup.add(hqMesh);

    // HQ Pulse Radar Ring
    const ringGeom = new THREE.RingGeometry(0.09, 0.18, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.copy(hqPos);
    ringMesh.lookAt(0, 0, 0);
    globeGroup.add(ringMesh);

    // D. Build Bezier Arcs for Dynamic Trade Routes
    const curves: { curve: THREE.QuadraticBezierCurve3; line: THREE.Line; length: number }[] = [];
    const routeGlows: { mesh: THREE.Mesh; progress: number; speed: number }[] = [];
    const pins: THREE.Mesh[] = [];

    activeDestinations.forEach((dest) => {
      const destPos = latLongToVector3(dest.lat, dest.lon, globeRadius);

      // Destination Pin
      const pinGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(destPos);
      globeGroup.add(pinMesh);
      pins.push(pinMesh);

      // Bezier Curve Arc High Above Globe Center
      const start = hqPos.clone();
      const end = destPos.clone();
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);

      const arcHeight = globeRadius + distance * 0.38;
      mid.normalize().multiplyScalar(arcHeight);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
      });

      const line = new THREE.Line(curveGeometry, lineMaterial);
      globeGroup.add(line);
      curves.push({ curve, line, length: points.length });

      // Glowing Pulse Particle traveling along the route
      const glowGeometry = new THREE.SphereGeometry(0.045, 12, 12);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.95,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      globeGroup.add(glowMesh);
      routeGlows.push({
        mesh: glowMesh,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.004,
      });
    });

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfde047, 0.5);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // 6. Interactive Drag & Rotate Controls with Damping
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.0025, y: 0.0008 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      globeGroup.rotation.y += deltaMove.x * 0.005;
      globeGroup.rotation.x += deltaMove.y * 0.005;

      globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));

      rotationVelocity = {
        x: deltaMove.x * 0.002,
        y: deltaMove.y * 0.002,
      };

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;

      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y,
      };

      globeGroup.rotation.y += deltaMove.x * 0.005;
      globeGroup.rotation.x += deltaMove.y * 0.005;

      globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));

      rotationVelocity = {
        x: deltaMove.x * 0.002,
        y: deltaMove.y * 0.002,
      };

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // 7. Animation Loop
    let animationId: number;
    let pulseTime = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Inertial auto-rotation with damping
      if (!isDragging) {
        globeGroup.rotation.y += rotationVelocity.x;
        globeGroup.rotation.x += rotationVelocity.y;

        rotationVelocity.x += (0.0018 - rotationVelocity.x) * 0.04;
        rotationVelocity.y += (0.0002 - rotationVelocity.y) * 0.04;
      }

      // HQ Radar Pulse
      pulseTime += 0.04;
      const ringScale = 1 + Math.sin(pulseTime) * 0.2;
      ringMesh.scale.set(ringScale, ringScale, 1);
      ringMat.opacity = Math.max(0.2, 0.7 - (ringScale - 0.8) * 1.5);

      // Animate trade pulses along curves
      routeGlows.forEach((glow, idx) => {
        glow.progress += glow.speed;
        if (glow.progress > 1) {
          glow.progress = 0;
          if (Math.random() > 0.7 && activeDestinations[idx]) {
            setActiveDestination(activeDestinations[idx].name);
          }
        }

        if (curves[idx]) {
          const point = curves[idx].curve.getPointAt(glow.progress);
          glow.mesh.position.copy(point);

          const scale = 0.6 + Math.sin(glow.progress * Math.PI) * 0.7;
          glow.mesh.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      try {
        container.removeChild(renderer.domElement);
      } catch (err) {
        // Ignored
      }

      dotGeometry.dispose();
      dotMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      hqGeometry.dispose();
      hqMaterial.dispose();
      ringGeom.dispose();
      ringMat.dispose();

      pins.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.Material).dispose();
      });

      curves.forEach((c) => {
        c.line.geometry.dispose();
        (c.line.material as THREE.Material).dispose();
      });

      routeGlows.forEach((rg) => {
        rg.mesh.geometry.dispose();
        (rg.mesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, [activeDestinations]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
        {/* Ambient Radial Backdrop Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-sky-400/15 via-transparent to-transparent filter blur-3xl -z-10 pointer-events-none" />

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute flex flex-col items-center gap-3 text-xs font-mono text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-accent-gold" />
            <span>CONNECTING GLOBAL CONDUITS...</span>
          </div>
        )}

        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Active Corridor Status Card */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 p-3.5 rounded-2xl border border-white/20 bg-slate-950/80 backdrop-blur-xl flex items-center gap-3 text-xs font-mono shadow-2xl">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping shrink-0" />
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-slate-400 uppercase tracking-widest text-[9px] leading-none">
              Active Trade Corridor
            </span>
            <span className="text-white font-bold text-sm leading-none mt-1 truncate max-w-[180px]">
              {activeDestination}
            </span>
          </div>
          <div className="ml-auto text-[#fde047] font-bold text-[10px] bg-accent-gold/15 px-2.5 py-1 border border-accent-gold/30 rounded-md uppercase shrink-0">
            Direct Dispatch
          </div>
        </div>
      </div>

      {/* Dynamic Global Trade Hubs Ribbon */}
      <div className="w-full flex flex-wrap items-center justify-center gap-1.5 px-2">
        {activeDestinations.slice(0, 6).map((dest) => {
          const isActive = activeDestination === dest.name;
          return (
            <button
              key={dest._id || dest.name}
              type="button"
              onClick={() => rotateToDestination(dest.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900/90 text-[#fde047] border border-[#fde047] shadow-lg shadow-[#fde047]/10 scale-105"
                  : "bg-slate-950/40 hover:bg-slate-900/70 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              <MapPin
                className={`w-3 h-3 ${
                  isActive ? "text-[#fde047]" : "text-sky-400"
                }`}
              />
              <span className="font-semibold text-[11px]">{dest.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
