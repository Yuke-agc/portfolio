import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import * as THREE from "three";
import type { BloomEffect as PostprocessingBloomEffect } from "postprocessing";
import type { TrailPathHandle } from "./TrailPath";
import { CUBE_EFFECTIVE_RADIUS, TRAIL_END_U, depthScale, getCurveLandmarks } from "./curve";

export type SplashTimelineRefs = {
  cubeMeshRef: RefObject<THREE.Mesh | null>;
  cubeMaterialRef: RefObject<THREE.MeshStandardMaterial | null>;
  cameraRef: RefObject<THREE.PerspectiveCamera | null>;
  lookAtRef: RefObject<THREE.Vector3>;
  trailRef: RefObject<TrailPathHandle | null>;
  bloomRef: RefObject<PostprocessingBloomEffect | null>;
};

type UseSplashTimelineOptions = {
  refs: SplashTimelineRefs;
  curve: THREE.Curve<THREE.Vector3> | null;
  /** Canvas がマウントされ、上記 ref が全て実体を持った状態になったか */
  ready: boolean;
  duration: number;
  onComplete: () => void;
  onTitleReveal: () => void;
};

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const BASE_BLOOM_INTENSITY = 0.6;

/** 設計書の時間割（6秒基準）を duration に対する割合として保持する */
const PHASE = {
  appearEnd: 0.5 / 6,
  driftEnd: 1.2 / 6,
  bigMoveEnd: 2.5 / 6,
  shapeEnd: 3.8 / 6,
  centerEnd: 4.5 / 6,
  bounceMid: 4.7 / 6,
  bounceEnd: 5.0 / 6,
  titleEnd: 5.5 / 6,
  end: 1,
};

/**
 * GSAP の単一 timeline が、立方体の位置・回転・スケール・不透明度、
 * カメラ、軌跡の表示範囲、Bloom の強さを毎フレーム直接書き換える。
 * React の state は一切更新しない（onTitleReveal / onComplete は
 * 「その瞬間に一度だけ」呼ばれるコールバックで、per-frame 更新ではない）。
 */
export function useSplashTimeline({
  refs,
  curve,
  ready,
  duration,
  onComplete,
  onTitleReveal,
}: UseSplashTimelineOptions) {
  const onCompleteRef = useRef(onComplete);
  const onTitleRevealRef = useRef(onTitleReveal);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTitleRevealRef.current = onTitleReveal;
  }, [onComplete, onTitleReveal]);

  useEffect(() => {
    if (!ready || !curve) return;

    const { cubeMeshRef, cubeMaterialRef, cameraRef, lookAtRef, trailRef, bloomRef } = refs;
    const landmarks = getCurveLandmarks();

    const state = {
      u: 0,
      appearIn: 0,
      overshoot: 0,
      brighten: 0,
    };

    const cubeQuat = new THREE.Quaternion();
    const prevPoint = curve.getPointAt(0).clone();
    const currentPoint = new THREE.Vector3();
    const nextPoint = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const rollAxis = new THREE.Vector3();
    const deltaQuat = new THREE.Quaternion();
    const endTangent = curve.getTangentAt(1).clone().normalize();

    function applyFrame() {
      const cube = cubeMeshRef.current;
      const material = cubeMaterialRef.current;
      const u = THREE.MathUtils.clamp(state.u, 0, 1);

      if (cube) {
        currentPoint.copy(curve!.getPointAt(u));
        if (u >= 1 - 1e-4 && state.overshoot !== 0) {
          currentPoint.addScaledVector(endTangent, state.overshoot);
        }
        cube.position.copy(currentPoint);

        const eps = 0.0015;
        nextPoint.copy(curve!.getPointAt(Math.min(u + eps, 1)));
        tangent.copy(nextPoint).sub(currentPoint);
        const distSincePrev = currentPoint.distanceTo(prevPoint);

        if (tangent.lengthSq() > 1e-10 && distSincePrev > 1e-6) {
          tangent.normalize();
          rollAxis.crossVectors(WORLD_UP, tangent);
          if (rollAxis.lengthSq() < 1e-6) {
            rollAxis.set(1, 0, 0);
          } else {
            rollAxis.normalize();
          }
          const dAngle = distSincePrev / CUBE_EFFECTIVE_RADIUS;
          deltaQuat.setFromAxisAngle(rollAxis, dAngle);
          cubeQuat.premultiply(deltaQuat);
          cube.quaternion.copy(cubeQuat);
        }
        prevPoint.copy(currentPoint);

        cube.scale.setScalar(state.appearIn * depthScale(currentPoint.z));
      }

      if (material) {
        material.opacity = state.appearIn;
        material.emissiveIntensity = 0.25 + state.brighten * 0.8;
      }

      const trailFraction = (u - landmarks.entryEnd) / (TRAIL_END_U - landmarks.entryEnd);
      trailRef.current?.setReveal(trailFraction);

      if (bloomRef.current) {
        bloomRef.current.intensity = BASE_BLOOM_INTENSITY + state.brighten * 1.2;
      }
    }

    const d = duration / 1000;
    const at = (fraction: number) => fraction * d;

    const tl = gsap.timeline({
      onUpdate: applyFrame,
      onComplete: () => onCompleteRef.current(),
    });

    // 0.00-0.50s: 暗闇から出現
    tl.to(state, { appearIn: 1, duration: at(PHASE.appearEnd), ease: "power2.out" }, at(0));

    // カメラ: わずかに寄ってから正面へ落ち着く（奥行きを感じさせる程度に留める）
    const camera = cameraRef.current;
    if (camera) {
      tl.to(
        camera.position,
        { x: 0.28, y: 0.15, z: 6.4, duration: at(PHASE.bigMoveEnd) - at(PHASE.appearEnd), ease: "sine.inOut" },
        at(PHASE.appearEnd)
      );
      tl.to(
        camera.position,
        { x: 0.08, y: 0.04, z: 6.0, duration: at(PHASE.shapeEnd) - at(PHASE.bigMoveEnd), ease: "sine.inOut" },
        at(PHASE.bigMoveEnd)
      );
      tl.to(
        camera.position,
        { x: 0, y: 0, z: 5.8, duration: at(PHASE.centerEnd) - at(PHASE.shapeEnd), ease: "power2.out" },
        at(PHASE.shapeEnd)
      );
    }
    tl.to(
      lookAtRef.current,
      { x: 0.1, y: 0.2, z: 0, duration: at(PHASE.bigMoveEnd) - at(PHASE.appearEnd), ease: "sine.inOut" },
      at(PHASE.appearEnd)
    );
    tl.to(
      lookAtRef.current,
      { x: 0.02, y: 0.02, z: 0, duration: at(PHASE.shapeEnd) - at(PHASE.bigMoveEnd), ease: "sine.inOut" },
      at(PHASE.bigMoveEnd)
    );
    tl.to(
      lookAtRef.current,
      { x: 0, y: 0, z: 0, duration: at(PHASE.centerEnd) - at(PHASE.shapeEnd), ease: "power2.out" },
      at(PHASE.shapeEnd)
    );

    // 0.50-1.20s: 助走。奥(z=-8)から円の描き始め(P3)まで一気に距離を詰める
    tl.to(
      state,
      { u: landmarks.entryEnd, duration: at(PHASE.driftEnd) - at(PHASE.appearEnd), ease: "power1.in" },
      at(PHASE.appearEnd)
    );
    // 1.20-2.50s: 大きく移動、軌跡が見え始める（P3→P6付近）
    tl.to(
      state,
      { u: landmarks.arcMid, duration: at(PHASE.bigMoveEnd) - at(PHASE.driftEnd), ease: "power2.inOut" },
      at(PHASE.driftEnd)
    );
    // 2.50-3.80s: 形状が見えてくる（P6→P10付近）
    tl.to(
      state,
      { u: landmarks.arcLate, duration: at(PHASE.shapeEnd) - at(PHASE.bigMoveEnd), ease: "power2.inOut" },
      at(PHASE.bigMoveEnd)
    );
    // 3.80-4.50s: 中心へ折れ込み、軌跡完成
    tl.to(
      state,
      { u: landmarks.final, duration: at(PHASE.centerEnd) - at(PHASE.shapeEnd), ease: "power3.out" },
      at(PHASE.shapeEnd)
    );

    // 4.50-5.00s: オーバーシュート → 静止、その瞬間に発光
    tl.to(
      state,
      { overshoot: 0.16, duration: at(PHASE.bounceMid) - at(PHASE.centerEnd), ease: "power1.out" },
      at(PHASE.centerEnd)
    );
    tl.to(
      state,
      { overshoot: 0, duration: at(PHASE.bounceEnd) - at(PHASE.bounceMid), ease: "elastic.out(1,0.45)" },
      at(PHASE.bounceMid)
    );
    tl.to(
      state,
      { brighten: 1, duration: at(PHASE.bounceEnd) - at(PHASE.centerEnd), ease: "power1.out" },
      at(PHASE.centerEnd)
    );
    tl.to(
      state,
      { brighten: 0.35, duration: at(PHASE.titleEnd) - at(PHASE.bounceEnd), ease: "power1.in" },
      at(PHASE.bounceEnd)
    );

    // 5.00-5.50s: タイトルフェードイン（一度きりのトリガー）
    tl.call(() => onTitleRevealRef.current(), [], at(PHASE.bounceEnd));

    // 5.50-6.00s: 静止したまま尺を持たせ、末尾で onComplete
    tl.to({}, { duration: at(PHASE.end) - at(PHASE.titleEnd) }, at(PHASE.titleEnd));

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, curve, duration]);
}
