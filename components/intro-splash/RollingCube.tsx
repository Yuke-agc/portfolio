import type { RefObject } from "react";
import type * as THREE from "three";
import { CUBE_SIZE } from "./curve";

type RollingCubeProps = {
  meshRef: RefObject<THREE.Mesh | null>;
  materialRef: RefObject<THREE.MeshStandardMaterial | null>;
};

/**
 * 転がる立方体本体。位置・回転・スケール・不透明度はすべて useSplashTimeline
 * 側から ref 経由で直接書き込まれるため、このコンポーネント自身は状態を持たない。
 * 面ごとの明暗は単一マテリアル + DirectionalLight のシェーディングだけで作る。
 */
export function RollingCube({ meshRef, materialRef }: RollingCubeProps) {
  return (
    <mesh ref={meshRef} scale={0.001}>
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#8b5cf6"
        emissive="#4c1d95"
        emissiveIntensity={0.25}
        roughness={0.35}
        metalness={0.2}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
