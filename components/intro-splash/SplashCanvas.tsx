import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { BloomEffect as PostprocessingBloomEffect } from "postprocessing";
import { CameraRig } from "./CameraRig";
import { RollingCube } from "./RollingCube";
import { TrailPath, type TrailPathHandle } from "./TrailPath";
import { BloomEffect } from "./BloomEffect";

type SplashCanvasProps = {
  shapeCurves: readonly THREE.Curve<THREE.Vector3>[];
  cubeMeshRef: RefObject<THREE.Mesh | null>;
  cubeMaterialRef: RefObject<THREE.MeshStandardMaterial | null>;
  cameraRef: RefObject<THREE.PerspectiveCamera | null>;
  lookAtRef: RefObject<THREE.Vector3>;
  trailRef: RefObject<TrailPathHandle | null>;
  bloomRef: RefObject<PostprocessingBloomEffect | null>;
  onReady: () => void;
};

/** <Canvas> 本体。カメラ・ライトの設定のみを担当し、演出ロジックは持たない */
export function SplashCanvas({
  shapeCurves,
  cubeMeshRef,
  cubeMaterialRef,
  cameraRef,
  lookAtRef,
  trailRef,
  bloomRef,
  onReady,
}: SplashCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={onReady}
    >
      <color attach="background" args={["#080809"]} />
      <ambientLight intensity={0.28} />
      <directionalLight castShadow position={[-3, 5, 4]} intensity={1.65} color="#fff4df" />
      <directionalLight position={[4, -2, 3]} intensity={0.65} color="#d9a566" />

      <mesh position={[0, 0, -0.32]} receiveShadow>
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial color="#0b0b0c" roughness={0.92} metalness={0.08} />
      </mesh>

      <CameraRig cameraRef={cameraRef} lookAtRef={lookAtRef} />
      <RollingCube meshRef={cubeMeshRef} materialRef={cubeMaterialRef} />
      <TrailPath ref={trailRef} curves={shapeCurves} />
      <BloomEffect bloomRef={bloomRef} />
    </Canvas>
  );
}
