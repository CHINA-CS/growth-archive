"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

/**
 * 第二章：菊花（Chrysanthemum）
 * 仿 2019.makemepulse 纸绘质感：多层细瓣、粉彩、慢开合
 * 保持轻量：无 transmission / 无粒子 / 低 DPR
 */

function makePetalGeometry() {
  // 细长花瓣：从花心向外弯的带状面
  const g = new THREE.PlaneGeometry(0.55, 1.7, 1, 8);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // y: -0.85 根部 → +0.85 尖端
    const t = (y + 0.85) / 1.7;
    // 宽度在中部最宽
    const widthScale = Math.sin(Math.PI * Math.min(1, Math.max(0, t))) * 0.55 + 0.2;
    pos.setX(i, x * widthScale);
    // 向外弯 + 轻微上卷
    const z = Math.sin(t * Math.PI * 0.85) * 0.55 + t * t * 0.25;
    pos.setZ(i, z);
    // 尖端收细
    if (t > 0.85) pos.setX(i, x * widthScale * (1 - (t - 0.85) * 4));
  }
  g.computeVertexNormals();
  // 把根部对齐到原点，方便绕 Y 旋转摆盘
  g.translate(0, 0.85, 0);
  return g;
}

function makeCenterGeometry() {
  return new THREE.SphereGeometry(0.28, 16, 12);
}

type Layer = {
  count: number;
  radius: number;
  tilt: number;
  scale: number;
  y: number;
  color: string;
  delay: number;
};

const LAYERS: Layer[] = [
  // 外层大瓣，色淡
  { count: 18, radius: 0.15, tilt: 1.15, scale: 1.05, y: -0.05, color: "#f0cfc8", delay: 0 },
  { count: 16, radius: 0.12, tilt: 0.95, scale: 0.92, y: 0.02, color: "#e8b8b4", delay: 0.15 },
  { count: 14, radius: 0.1, tilt: 0.75, scale: 0.78, y: 0.08, color: "#e0aaa8", delay: 0.3 },
  { count: 12, radius: 0.08, tilt: 0.55, scale: 0.62, y: 0.14, color: "#d49698", delay: 0.45 },
  // 内层更立
  { count: 10, radius: 0.05, tilt: 0.35, scale: 0.45, y: 0.2, color: "#c88890", delay: 0.6 },
  { count: 8, radius: 0.03, tilt: 0.18, scale: 0.32, y: 0.26, color: "#b87880", delay: 0.72 },
];

function PetalRing({
  layer,
  petalGeo,
  bloom,
}: {
  layer: Layer;
  petalGeo: THREE.BufferGeometry;
  bloom: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  const items = useMemo(
    () =>
      Array.from({ length: layer.count }, (_, i) => {
        const angle = (i / layer.count) * Math.PI * 2 + layer.delay;
        return { angle, spin: (i % 2) * 0.04 - 0.02 };
      }),
    [layer.count, layer.delay]
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const open = 0.25 + bloom.current * 0.75;
    group.current.children.forEach((child, i) => {
      const it = items[i];
      if (!it) return;
      // 开合：tilt 随 bloom 变大（更展开）
      const tilt = layer.tilt * (0.35 + open * 0.75);
      child.rotation.set(-tilt + Math.sin(t * 0.6 + i) * 0.02, it.angle, it.spin);
      const s = layer.scale * (0.4 + open * 0.7);
      child.scale.setScalar(s);
    });
  });

  return (
    <group ref={group} position={[0, layer.y, 0]}>
      {items.map((it, i) => (
        <mesh
          key={i}
          geometry={petalGeo}
          position={[
            Math.sin(it.angle) * layer.radius,
            0,
            Math.cos(it.angle) * layer.radius,
          ]}
        >
          <meshStandardMaterial
            color={layer.color}
            roughness={0.75}
            metalness={0}
            side={THREE.DoubleSide}
            flatShading
            transparent
            opacity={0.94}
          />
        </mesh>
      ))}
    </group>
  );
}

function Chrysanthemum({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  seed = 0,
}) {
  const bloom = useRef(0.15);
  const root = useRef<THREE.Group>(null);
  const petalGeo = useMemo(() => makePetalGeometry(), []);
  const centerGeo = useMemo(() => makeCenterGeometry(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime + seed;
    // 缓慢呼吸式开花
    bloom.current = 0.45 + Math.sin(t * 0.35) * 0.35 + 0.2;
    if (root.current) {
      root.current.rotation.y = t * 0.08;
      root.current.position.y = position[1] + Math.sin(t * 0.5) * 0.06;
    }
  });

  return (
    <group ref={root} position={position} scale={scale}>
      {LAYERS.map((layer, i) => (
        <PetalRing key={i} layer={layer} petalGeo={petalGeo} bloom={bloom} />
      ))}
      <mesh geometry={centerGeo} position={[0, 0.22, 0]}>
        <meshStandardMaterial color="#c9a05a" roughness={0.9} flatShading />
      </mesh>
      {/* 细茎 */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.4, 6]} />
        <meshStandardMaterial color="#7fa392" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
      <circleGeometry args={[12, 48]} />
      <meshStandardMaterial color="#8a9a8e" roughness={1} flatShading />
    </mesh>
  );
}

function DistantHills() {
  const mesh = useMemo(() => {
    const g = new THREE.PlaneGeometry(36, 8, 20, 4);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(x * 0.4) * 0.6 + Math.cos(x * 0.15) * 0.9);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={mesh} position={[0, -0.8, -9]} rotation={[-0.15, 0, 0]}>
      <meshStandardMaterial color="#6b7a88" roughness={1} flatShading />
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
  const target = useMemo(() => new THREE.Vector3(0, 0.1, 0), []);

  useFrame((state) => {
    if (!active) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const orbit = t * 0.06 + p * 0.5;
    const radius = 4.6 - p * 1.0;
    const height = 0.9 - p * 0.25;
    camera.position.x = Math.sin(orbit) * radius + state.pointer.x * 0.2;
    camera.position.z = Math.cos(orbit) * radius;
    camera.position.y = height + state.pointer.y * 0.12;
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
      {/* 粉彩天空 — 呼应原站 blush 云层 */}
      <color attach="background" args={["#e8c8c4"]} />
      <fog attach="fog" args={["#e4c0bc", 9, 22]} />
      <ambientLight intensity={1.05} color="#f5e8e0" />
      <directionalLight position={[3, 7, 2]} intensity={1.5} color="#fff5ee" />
      <directionalLight position={[-4, 3, -1]} intensity={0.7} color="#a8c4d8" />

      <CameraRig progress={scrollProgress} active={active} />
      <Ground />
      <DistantHills />

      <Chrysanthemum position={[0, 0.2, 0]} scale={1.05} seed={0} />
      <Chrysanthemum position={[-2.2, -0.15, 0.6]} scale={0.55} seed={1.7} />
      <Chrysanthemum position={[2.0, -0.25, 0.4]} scale={0.48} seed={3.1} />
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
        dpr={[1, 1.25]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0.9, 4.8], fov: 40, near: 0.5, far: 36 }}
      >
        <Scene scrollProgress={scrollProgress} active={active} />
      </Canvas>
      <div className="absolute inset-0 bg-[url('/mm/background_white_pattern.jpg')] bg-repeat opacity-[0.08]" />
    </div>
  );
}
