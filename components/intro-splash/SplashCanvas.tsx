import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { BloomEffect as PostprocessingBloomEffect } from "postprocessing";
import { CameraRig } from "./CameraRig";
import { RollingCube } from "./RollingCube";
import { TrailPath, type TrailPathHandle } from "./TrailPath";
import { BloomEffect } from "./BloomEffect";

type SplashCanvasProps = {
  shapeCurve: THREE.CatmullRomCurve3;
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
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 2]} intensity={1.5} color="#f4ecff" />

      <CameraRig cameraRef={cameraRef} lookAtRef={lookAtRef} />
      <RollingCube meshRef={cubeMeshRef} materialRef={cubeMaterialRef} />
      <TrailPath ref={trailRef} curve={shapeCurve} />
      <BloomEffect bloomRef={bloomRef} />
    </Canvas>
  );
}
