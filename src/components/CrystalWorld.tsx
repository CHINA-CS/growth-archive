"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/** 水面涟漪环 */
function Ripples() {
  const rings = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        key: i,
        radius: 1.1 + i * 0.55,
        y: -1.35 + i * 0.02,
        opacity: 0.35 - i * 0.08,
      })),
    []
  );
  return (
    <group position={[0, 0, 0]}>
      {rings.map((r) => (
        <mesh key={r.key} rotation={[-Math.PI / 2, 0, 0]} position={[0, r.y, 0]}>
          <ringGeometry args={[r.radius, r.radius + 0.035, 64]} />
          <meshBasicMaterial color="#e8f0f8" transparent opacity={r.opacity} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/** 单块晶体：车削轮廓生成连续六棱宝石，避免拼接黑面 */
function Crystal({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  tint = "#a8c4d8",
}: {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  tint?: string;
}) {
  const geo = useMemo(() => {
    // 轮廓：底收腰 → 柱身 → 尖顶（Lathe 绕 Y，radial 6 成六棱）
    const pts = [
      new THREE.Vector2(0.02, -1.05),
      new THREE.Vector2(0.32, -0.95),
      new THREE.Vector2(0.42, -0.55),
      new THREE.Vector2(0.46, 0.15),
      new THREE.Vector2(0.4, 0.55),
      new THREE.Vector2(0.28, 0.95),
      new THREE.Vector2(0.02, 1.35),
    ];
    const g = new THREE.LatheGeometry(pts, 6);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <Float speed={1.05} rotationIntensity={0.28} floatIntensity={0.45}>
      <mesh geometry={geo} position={position} scale={scale} rotation={rotation}>
        {/* 物理透明材质，不依赖远程 HDR */}
        <meshPhysicalMaterial
          color={tint}
          transmission={0.82}
          thickness={0.9}
          roughness={0.22}
          metalness={0.05}
          ior={1.4}
          transparent
          opacity={0.92}
          clearcoat={1}
          clearcoatRoughness={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

/** 远山剪影（低多边形） */
function DistantLandscape() {
  const mesh = useMemo(() => {
    const g = new THREE.PlaneGeometry(40, 12, 48, 12);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const h =
        Math.sin(x * 0.35) * 0.8 +
        Math.cos(x * 0.18 + y * 0.2) * 1.1 +
        Math.sin(x * 0.9) * 0.25;
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

/** 水面 */
function Water() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
      <circleGeometry args={[12, 64]} />
      <meshStandardMaterial color="#5b6a8a" roughness={0.25} metalness={0.35} />
    </mesh>
  );
}

function CameraRig({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);

  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;
    // 慢 orbit + 随滚动 dolly
    const orbit = t * 0.08 + p * 0.6;
    const radius = 5.2 - p * 1.4;
    const height = 1.1 - p * 0.45 + Math.sin(t * 0.4) * 0.05;
    camera.position.x = Math.sin(orbit) * radius;
    camera.position.z = Math.cos(orbit) * radius;
    camera.position.y = height;
    // 鼠标视差
    camera.position.x += state.pointer.x * 0.35;
    camera.position.y += state.pointer.y * 0.2;
    camera.lookAt(target);
  });
  return null;
}

function Scene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#e8d5cf"]} />
      <fog attach="fog" args={["#e4c8c4", 8, 22]} />
      <ambientLight intensity={1.0} color="#f0e4dc" />
      <directionalLight position={[4, 6, 2]} intensity={1.8} color="#fff2e8" />
      <directionalLight position={[-3, 2, -2]} intensity={0.9} color="#a8c4d8" />
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#e8c8c4" />

      <CameraRig progress={scrollProgress} />

      <Water />
      <Ripples />
      <DistantLandscape />

      <group position={[0, 0.35, 0]}>
        <Crystal position={[0, 0.85, -0.2]} scale={0.95} tint="#c5dcec" rotation={[0.03, 0.3, 0.01]} />
        <Crystal position={[-1.85, 0.35, 0.4]} scale={0.62} tint="#d4e4f0" rotation={[0.06, -0.5, 0]} />
        <Crystal position={[1.7, 0.25, 0.3]} scale={0.52} tint="#b8d0e4" rotation={[-0.05, 0.75, 0.03]} />
      </group>

      <Sparkles count={40} scale={[8, 4, 8]} size={1.8} speed={0.35} color="#f4efe4" opacity={0.45} />
    </>
  );
}

/**
 * 全屏 3D 叙事画布：晶体 + 水面 + 运镜
 * scrollProgress 由外部 0→1 驱动 dolly
 */
export function CrystalWorld({ className = "" }: { className?: string }) {
  const scrollProgress = useRef(0);

  // 滚动进度驱动相机 dolly
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollProgress.current = Math.min(1, Math.max(0, window.scrollY / max));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 1.1, 6.2], fov: 38, near: 0.1, far: 40 }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
      {/* 纸纹叠层，压住 CG 感，贴合插画站 */}
      <div className="absolute inset-0 bg-[url('/mm/background_white_pattern.jpg')] bg-repeat opacity-[0.1] mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(243,238,227,0.08),transparent_40%,rgba(91,106,138,0.08))]" />
    </div>
  );
}
