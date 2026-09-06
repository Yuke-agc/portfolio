"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { BloomEffect as PostprocessingBloomEffect } from "postprocessing";
import { SplashCanvas } from "./SplashCanvas";
import type { TrailPathHandle } from "./TrailPath";
import { TitleText } from "./TitleText";
import { useSplashTimeline } from "./useSplashTimeline";
import { createSplashCurve, createShapeCurves } from "./curve";

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
export function IntroSplash({ duration = 6000, onComplete, title = "YK" }: IntroSplashProps) {
  const curve = useMemo(() => createSplashCurve(), []);
  const shapeCurves = useMemo(() => createShapeCurves(), []);

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
      role="dialog"
      aria-label="YKイントロアニメーション"
    >
      <SplashCanvas
        shapeCurves={shapeCurves}
        cubeMeshRef={cubeMeshRef}
        cubeMaterialRef={cubeMaterialRef}
        cameraRef={cameraRef}
        lookAtRef={lookAtRef}
        trailRef={trailRef}
        bloomRef={bloomRef}
        onReady={() => setReady(true)}
      />
      <TitleText title={title} visible={showTitle} />
      <button
        type="button"
        onClick={onComplete}
        className="absolute right-5 top-5 min-h-11 rounded-full border border-white/15 px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-white/55 transition hover:border-white/30 hover:text-white sm:right-8 sm:top-8"
      >
        Skip
      </button>
    </div>
  );
}
