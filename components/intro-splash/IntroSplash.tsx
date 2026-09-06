"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { BloomEffect as PostprocessingBloomEffect } from "postprocessing";
import { SplashCanvas } from "./SplashCanvas";
import type { TrailPathHandle } from "./TrailPath";
import { TitleText } from "./TitleText";
import { useSplashTimeline } from "./useSplashTimeline";
import { createSplashCurve, createShapeCurve } from "./curve";

export type IntroSplashProps = {
  /** アニメーション全体の尺(ms)。区間の比率は維持したままスケールする */
  duration?: number;
  onComplete: () => void;
  /** ロゴ下に表示する仮タイトル。後で差し替え可能 */
  title?: string;
};

/**
 * トップページ表示前に一度だけ再生する、立方体の運動でロゴを描く3Dイントロ。
 * 内部の演出ロジック（位置・回転・軌跡・カメラ・グロー）はすべて
 * useSplashTimeline 経由の GSAP timeline が ref を直接書き換えて駆動する。
 */
export function IntroSplash({ duration = 6000, onComplete, title = "MY APP" }: IntroSplashProps) {
  const curve = useMemo(() => createSplashCurve(), []);
  const shapeCurve = useMemo(() => createShapeCurve(), []);

  const cubeMeshRef = useRef<THREE.Mesh | null>(null);
  const cubeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lookAtRef = useRef(new THREE.Vector3(0, 0.3, 0));
  const trailRef = useRef<TrailPathHandle | null>(null);
  const bloomRef = useRef<PostprocessingBloomEffect | null>(null);

  const [ready, setReady] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useSplashTimeline({
    refs: { cubeMeshRef, cubeMaterialRef, cameraRef, lookAtRef, trailRef, bloomRef },
    curve,
    ready,
    duration,
    onComplete,
    onTitleReveal: () => setShowTitle(true),
  });

  return (
    <div
      className="intro-splash fixed inset-0 z-[200] h-dvh w-screen bg-black"
      aria-hidden="true"
    >
      <SplashCanvas
        shapeCurve={shapeCurve}
        cubeMeshRef={cubeMeshRef}
        cubeMaterialRef={cubeMaterialRef}
        cameraRef={cameraRef}
        lookAtRef={lookAtRef}
        trailRef={trailRef}
        bloomRef={bloomRef}
        onReady={() => setReady(true)}
      />
      <TitleText title={title} visible={showTitle} />
    </div>
  );
}
