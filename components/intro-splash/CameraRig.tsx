import type { RefObject } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";

type CameraRigProps = {
  cameraRef: RefObject<THREE.PerspectiveCamera | null>;
  lookAtRef: RefObject<THREE.Vector3>;
};

/**
 * カメラの position は useSplashTimeline が gsap で直接 tween する。
 * ここでは「常に lookAtRef が指す点を向き続ける」処理だけを毎フレーム行う。
 */
export function CameraRig({ cameraRef, lookAtRef }: CameraRigProps) {
  useFrame(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.lookAt(lookAtRef.current);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={45}
      near={0.1}
      far={30}
      position={[0, 0.3, 6.5]}
    />
  );
}
