"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

/**
 * 轻量 3D 晶体世界：
 * - 不用 transmission（透射要额外 render pass，最卡）
 * - 低 DPR、关 antialias、少灯、无粒子
 * - 滚出首屏后暂停渲染
 */

function Ripples() {
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const radius = 1.1 + i * 0.55;
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
            <ringGeometry args={[radius, radius + 0.04, 32]} />
            <meshBasicMaterial
              color="#dce8f2"
              transparent
              opacity={0.28 - i * 0.07}
              side={THREE.FrontSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Crystal({
  position,
  scale = 1,
  rotationY = 0,
  tint = "#a8c4d8",
}: {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
  tint?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.02, -1.05),
      new THREE.Vector2(0.32, -0.95),
      new THREE.Vector2(0.42, -0.55),
      new THREE.Vector2(0.46, 0.15),
      new THREE.Vector2(0.4, 0.55),
      new THREE.Vector2(0.28, 0.95),
      new THREE.Vector2(0.02, 1.35),
    ];
    return new THREE.LatheGeometry(pts, 6);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // 极便宜的漂浮：只改 y / rotY，无额外组件
    ref.current.rotation.y = rotationY + t * 0.12;
    ref.current.position.y = position[1] + Math.sin(t * 0.7 + position[0]) * 0.04;
  });

  return (
    <mesh ref={ref} geometry={geo} position={position} scale={scale}>
      {/* 廉价玻璃感：标准材质 + 半透明 + 自发光，避免 transmission */}
      <meshStandardMaterial
        color={tint}
        roughness={0.15}
        metalness={0.12}
        transparent
        opacity={0.78}
        emissive={tint}
        emissiveIntensity={0.18}
        side={THREE.FrontSide}
        flatShading
      />
    </mesh>
  );
}

function DistantLandscape() {
  const mesh = useMemo(() => {
    const g = new THREE.PlaneGeometry(36, 10, 24, 6);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const h =
        Math.sin(x * 0.35) * 0.8 + Math.cos(x * 0.18 + y * 0.2) * 1.1 + Math.sin(x * 0.9) * 0.25;
      pos.setZ(i, h * 0.35);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={mesh} position={[0, -1.2, -8]} rotation={[-0.2, 0, 0]}>
      <meshStandardMaterial color="#6b7288" roughness={1} metalness={0} flatShading />
    </mesh>
  );
}

function Water() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
      <circleGeometry args={[10, 48]} />
      <meshStandardMaterial color="#5b6a8a" roughness={0.35} metalness={0.2} />
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

  useFrame((state, delta) => {
    if (!active) return;
    const p = progress.current;
    const t = state.clock.elapsedTime;
    // 用 delta 限频感，避免过度采样 pointer
    const orbit = t * 0.07 + p * 0.5;
    const radius = 5.4 - p * 1.2;
    const height = 1.15 - p * 0.4;
    const px = state.pointer.x * 0.25;
    const py = state.pointer.y * 0.15;
    camera.position.x = Math.sin(orbit) * radius + px;
    camera.position.z = Math.cos(orbit) * radius;
    camera.position.y = height + py;
    camera.lookAt(target);
    void delta;
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
      <color attach="background" args={["#e8d5cf"]} />
      <fog attach="fog" args={["#e4c8c4", 10, 24]} />
      <ambientLight intensity={1.1} color="#f0e4dc" />
      <directionalLight position={[4, 6, 2]} intensity={1.6} color="#fff2e8" />

      <CameraRig progress={scrollProgress} active={active} />

      <Water />
      <Ripples />
      <DistantLandscape />

      <Crystal position={[0, 1.2, -0.2]} scale={0.95} tint="#c5dcec" rotationY={0.3} />
      <Crystal position={[-1.85, 0.7, 0.4]} scale={0.62} tint="#d4e4f0" rotationY={-0.5} />
      <Crystal position={[1.7, 0.6, 0.3]} scale={0.52} tint="#b8d0e4" rotationY={0.8} />
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
      // 离开首屏后停掉 3D 帧循环
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
        camera={{ position: [0, 1.1, 6.2], fov: 38, near: 0.5, far: 36 }}
      >
        <Scene scrollProgress={scrollProgress} active={active} />
      </Canvas>
      {/* 纸纹叠层：避免 mix-blend-multiply 全屏合成 */}
      <div className="absolute inset-0 bg-[url('/mm/background_white_pattern.jpg')] bg-repeat opacity-[0.08]" />
    </div>
  );
}
