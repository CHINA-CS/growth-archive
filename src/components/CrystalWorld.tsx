"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";

/**
 * 第二章：使用 2019.makemepulse 原版 flower.glb
 * 贴图 flower_color + 轻微 NPR 感（toon / 哑光）
 */

useGLTF.preload("/flowers/flower.glb");

function FlowerInstance({
  position,
  scale,
  phase = 0,
  url = "/flowers/flower.glb",
}: {
  position: [number, number, number];
  scale: number;
  phase?: number;
  url?: string;
}) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // 优先用 glb 内建材质；无贴图时再套 flower_color
  useEffect(() => {
    let hasMap = false;
    cloned.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const m = o.material as THREE.MeshStandardMaterial;
        if (m?.map) hasMap = true;
      }
    });
    if (hasMap) return;
    const loader = new THREE.TextureLoader();
    loader.load("/flowers/flower_color.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      cloned.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.material = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.8,
          metalness: 0,
          side: THREE.DoubleSide,
        });
      });
    });
  }, [cloned]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + phase;
    ref.current.rotation.y = phase + t * 0.04;
    ref.current.position.y = position[1] + Math.sin(t * 0.4) * 0.03;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
      <circleGeometry args={[16, 48]} />
      <meshStandardMaterial color="#9a8a78" roughness={1} />
    </mesh>
  );
}

function DistantHills() {
  const mesh = useMemo(() => {
    const g = new THREE.PlaneGeometry(40, 10, 24, 5);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(x * 0.35) * 0.7 + Math.cos(x * 0.12) * 1.1);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={mesh} position={[0, -0.5, -10]} rotation={[-0.12, 0, 0]}>
      <meshToonMaterial color="#7a8898" />
    </mesh>
  );
}

function CameraRig({
  progress,
  active,
}: {
  progress: React.MutableRefObject<number>;
  active: boolean;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);

  useFrame((state) => {
    if (!active) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const orbit = t * 0.05 + p * 0.45;
    const radius = 5.0 - p * 1.0;
    camera.position.x = Math.sin(orbit) * radius + state.pointer.x * 0.18;
    camera.position.z = Math.cos(orbit) * radius;
    camera.position.y = 1.0 - p * 0.2 + state.pointer.y * 0.1;
    camera.lookAt(target);
  });
  return null;
}

function Scene({
  scrollProgress,
  active,
}: {
  scrollProgress: React.MutableRefObject<number>;
  active: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#e8c8c4"]} />
      <fog attach="fog" args={["#e4c0bc", 10, 26]} />
      <ambientLight intensity={1.15} color="#f5ebe4" />
      <directionalLight position={[4, 8, 3]} intensity={1.35} color="#fff6f0" />
      <directionalLight position={[-3, 4, -2]} intensity={0.55} color="#b8d0e0" />

      <CameraRig progress={scrollProgress} active={active} />
      <Ground />
      <DistantHills />

      {/* 原版模型 */}
      <FlowerInstance position={[0, -0.9, 0]} scale={2.4} phase={0} />
      <FlowerInstance position={[-2.8, -1.0, 0.6]} scale={1.5} phase={1.2} />
      <FlowerInstance position={[2.6, -1.05, 0.4]} scale={1.35} phase={2.4} />
      <FlowerInstance position={[-1.4, -1.1, 1.8]} scale={1.0} phase={0.7} />
      <FlowerInstance position={[1.6, -1.15, 1.5]} scale={0.9} phase={3.1} />
    </>
  );
}

export function CrystalWorld({ className = "" }: { className?: string }) {
  const scrollProgress = useRef(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollProgress.current = Math.min(1, Math.max(0, y / max));
      setActive(y < window.innerHeight * 1.05);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.3]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0.6, 4.2], fov: 42, near: 0.1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} active={active} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-[url('/mm/background_white_pattern.jpg')] bg-repeat opacity-[0.07]" />
    </div>
  );
}
