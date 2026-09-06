import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { BloomEffect as PostprocessingBloomEffect } from "postprocessing";
import { CameraRig } from "./CameraRig";
import { RollingCube } from "./RollingCube";
import { TrailPath, type TrailPathHandle } from "./TrailPath";
import { BloomEffect } from "./BloomEffect";

type SplashCanvasProps = {
  shapeCurve: THREE.Curve<THREE.Vector3>;
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
  shapeCurve,
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
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      onCreated={onReady}
    >
      <color attach="background" args={["#080809"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 5, 4]} intensity={2.2} color="#fff4df" />
      <directionalLight position={[4, -2, 3]} intensity={1.1} color="#d9a566" />

      <CameraRig cameraRef={cameraRef} lookAtRef={lookAtRef} />
      <RollingCube meshRef={cubeMeshRef} materialRef={cubeMaterialRef} />
      <TrailPath ref={trailRef} curve={shapeCurve} />
      <BloomEffect bloomRef={bloomRef} />
    </Canvas>
  );
}
