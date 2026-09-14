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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, 0]}>
      <circleGeometry args={[30, 64]} />
      <meshStandardMaterial color="#9aa888" roughness={1} />
    </mesh>
  );
}

/** 远处更淡的地平色，靠雾融入天空，不用立体山 */
function Horizon() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, -10]}>
      <circleGeometry args={[36, 48]} />
      <meshStandardMaterial color="#c4b4a8" roughness={1} />
    </mesh>
  );
}

/** 花粉光点 */
function Pollen() {
  const count = 50;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = -0.5 + Math.random() * 3.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.02;
    ref.current.position.y = Math.sin(t * 0.2) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#f4efe4" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

/** 花田布置 */
const FLOWER_SPOTS: { p: [number, number, number]; s: number; ph: number }[] = [
  // 主花
  { p: [0, -0.9, 0], s: 2.5, ph: 0 },
  // 前景
  { p: [-2.6, -1.05, 1.6], s: 1.35, ph: 0.4 },
  { p: [2.4, -1.1, 1.4], s: 1.2, ph: 1.1 },
  // 中景
  { p: [-3.6, -1.0, -0.2], s: 1.6, ph: 1.8 },
  { p: [3.5, -1.05, -0.1], s: 1.45, ph: 2.3 },
  { p: [-1.5, -1.1, 2.4], s: 0.85, ph: 0.9 },
  { p: [1.7, -1.15, 2.2], s: 0.75, ph: 2.8 },
  // 远景小花
  { p: [-5.2, -1.05, -2.2], s: 1.1, ph: 0.2 },
  { p: [5.0, -1.1, -2.0], s: 1.0, ph: 1.5 },
  { p: [-4.2, -1.1, -3.5], s: 0.9, ph: 2.0 },
  { p: [4.4, -1.15, -3.2], s: 0.85, ph: 0.6 },
  { p: [0.2, -1.2, -4.5], s: 1.0, ph: 1.2 },
  { p: [-2.0, -1.2, -5.0], s: 0.9, ph: 2.6 },
  { p: [2.2, -1.2, -5.2], s: 0.8, ph: 3.0 },
];

function CameraRig({
  progress,
  active,
}: {
  progress: React.MutableRefObject<number>;
  active: boolean;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.15, 0), []);

  useFrame((state) => {
    if (!active) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const orbit = t * 0.045 + p * 0.4;
    const radius = 5.2 - p * 1.0;
    camera.position.x = Math.sin(orbit) * radius + state.pointer.x * 0.16;
    camera.position.z = Math.cos(orbit) * radius;
    camera.position.y = 0.85 - p * 0.15 + state.pointer.y * 0.08;
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
      <fog attach="fog" args={["#e4c0bc", 14, 36]} />
      <ambientLight intensity={1.25} color="#f5ebe4" />
      <directionalLight position={[4, 8, 3]} intensity={1.45} color="#fff6f0" />
      <directionalLight position={[-3, 4, -2]} intensity={0.5} color="#b8d0e0" />

      <CameraRig progress={scrollProgress} active={active} />
      <Ground />
      <Horizon />
      <Pollen />

      {FLOWER_SPOTS.map((f, i) => (
        <FlowerInstance key={i} position={f.p} scale={f.s} phase={f.ph} />
      ))}
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
