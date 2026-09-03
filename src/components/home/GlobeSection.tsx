"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Globe, RefreshCw } from "lucide-react";

// Geographic coordinates
const ANAND_GUJARAT = { lat: 22.56, lon: 72.93, name: "Anand, Gujarat (HQ)" };
const TRADE_DESTINATIONS = [
  { lat: 40.7128, lon: -74.006, name: "New York, USA" },
  { lat: 51.5074, lon: -0.1278, name: "London, UK" },
  { lat: 35.6762, lon: 139.6503, name: "Tokyo, Japan" },
  { lat: -33.8688, lon: 151.2093, name: "Sydney, Australia" },
  { lat: 50.1109, lon: 8.6821, name: "Frankfurt, Germany" },
];

// Translate Lat/Lon to 3D Cartesian coordinates
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
}

export default function GlobeSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDestination, setActiveDestination] = useState<string>("Global Trade Active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    setLoading(false);
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.08);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create Globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 2.2;

    // A. Dot-Matrix Sphere (futuristic dotted mesh)
    const dotCount = 1800;
    const dotGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const colors = new Float32Array(dotCount * 3);

    // Distribute points evenly on sphere using Fibonacci Lattice
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

      // Color nodes based on position (subtle gradient)
      const dotColor = new THREE.Color(i % 10 === 0 ? 0xb48e28 : 0x0a2540);
      colors[index] = dotColor.r;
      colors[index + 1] = dotColor.g;
      colors[index + 2] = dotColor.b;
    }

    dotGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const dotMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const globeDots = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(globeDots);

    // B. Add Inner Glowing Core
    const coreGeometry = new THREE.SphereGeometry(globeRadius - 0.02, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a2540,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // C. Plot Headquarters (Anand, Gujarat)
    const hqPos = latLongToVector3(ANAND_GUJARAT.lat, ANAND_GUJARAT.lon, globeRadius);
    const hqGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const hqMaterial = new THREE.MeshBasicMaterial({ color: 0xb48e28 });
    const hqMesh = new THREE.Mesh(hqGeometry, hqMaterial);
    hqMesh.position.copy(hqPos);
    globeGroup.add(hqMesh);

    // HQ Ring Glow
    const ringGeom = new THREE.RingGeometry(0.08, 0.14, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xb48e28,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.copy(hqPos);
    ringMesh.lookAt(0, 0, 0);
    globeGroup.add(ringMesh);

    // D. Build Bezier Arcs for Trade Routes
    const curves: { curve: THREE.QuadraticBezierCurve3; line: THREE.Line; length: number }[] = [];
    const routeGlows: { mesh: THREE.Mesh; progress: number; speed: number }[] = [];

    TRADE_DESTINATIONS.forEach((dest) => {
      const destPos = latLongToVector3(dest.lat, dest.lon, globeRadius);

      // Create pin for destination
      const pinGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0x0052cc });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(destPos);
      globeGroup.add(pinMesh);

      // Generate Bezier Curve control point arc high above the center
      const start = hqPos.clone();
      const end = destPos.clone();
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);

      // Arc height depends on distance
      const arcHeight = globeRadius + distance * 0.4;
      mid.normalize().multiplyScalar(arcHeight);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x0052cc,
        transparent: true,
        opacity: 0.25,
      });

      const line = new THREE.Line(curveGeometry, lineMaterial);
      globeGroup.add(line);
      curves.push({ curve, line, length: points.length });

      // Add a moving glowing dot on the route
      const glowGeometry = new THREE.SphereGeometry(0.03, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x0052cc,
        transparent: true,
        opacity: 0.8,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      globeGroup.add(glowMesh);
      routeGlows.push({
        mesh: glowMesh,
        progress: Math.random(), // Random initial progress
        speed: 0.005 + Math.random() * 0.004,
      });
    });

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x0052cc, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xb48e28, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // 6. Interactive Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.003, y: 0.001 }; // Initial auto rotation

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

      // Restrict rotation on X axis to avoid flipping upside down
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

    // Mobile touch support
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

      // Auto rotation with damping
      if (!isDragging) {
        globeGroup.rotation.y += rotationVelocity.x;
        globeGroup.rotation.x += rotationVelocity.y;

        // Damp the dragging kinetic energy gradually back to default
        rotationVelocity.x += (0.002 - rotationVelocity.x) * 0.05;
        rotationVelocity.y += (0.0002 - rotationVelocity.y) * 0.05;
      }

      // Pulse HQ Ring size
      pulseTime += 0.05;
      const ringScale = 1 + Math.sin(pulseTime) * 0.15;
      ringMesh.scale.set(ringScale, ringScale, 1);
      ringMat.opacity = 0.6 - (ringScale - 0.85) * 2;

      // Update moving trade route particles
      routeGlows.forEach((glow, index) => {
        glow.progress += glow.speed;
        if (glow.progress > 1) {
          glow.progress = 0;
          // Rotate target destination indicator text on reset
          if (Math.random() > 0.6) {
            setActiveDestination(TRADE_DESTINATIONS[index].name);
          }
        }

        const point = curves[index].curve.getPointAt(glow.progress);
        glow.mesh.position.copy(point);

        // Scale dot size slightly during high arc mid-point
        const scale = 0.5 + Math.sin(glow.progress * Math.PI) * 0.8;
        glow.mesh.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle window resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 500;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 9. Clean up on unmount
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

      // Dispose webgl context resources
      dotGeometry.dispose();
      dotMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      hqGeometry.dispose();
      hqMaterial.dispose();
      ringGeom.dispose();
      ringMat.dispose();

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
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing">
      {/* Glow Backdrops */}
      <div className="absolute inset-0 bg-radial-gradient from-accent-blue/5 to-transparent filter blur-2xl -z-10" />

      {/* Loading state indicator */}
      {loading && (
        <div className="absolute flex flex-col items-center gap-3 text-sm font-mono text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-accent-gold" />
          <span>BOOTING TRADE NETWORKS...</span>
        </div>
      )}

      {/* Canvas container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Interactive Hub status floating overlay card */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 p-4 rounded-xl border border-slate-200/60 glass-panel backdrop-blur-md flex items-center gap-4 text-xs max-w-xs font-mono shadow-2xl">
        <div className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse shrink-0" />
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-slate-400 uppercase tracking-widest text-[9px] leading-none">
            Active Conduit
          </span>
          <span className="text-slate-900 font-medium text-xs leading-none mt-1">
            {activeDestination}
          </span>
        </div>
        <div className="ml-auto text-[#d4af37] text-[10px] bg-[#d4af37]/5 px-2 py-1 border border-[#d4af37]/15 rounded uppercase">
          Anand HQ
        </div>
      </div>
    </div>
  );
}
