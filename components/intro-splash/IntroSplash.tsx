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
};

/**
 * トップページ表示前に一度だけ再生する、立方体の運動でロゴを描く3Dイントロ。
 * 内部の演出ロジック（位置・回転・軌跡・カメラ・グロー）はすべて
 * useSplashTimeline 経由の GSAP timeline が ref を直接書き換えて駆動する。
 */
export function IntroSplash({ duration = 4200, onComplete }: IntroSplashProps) {
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
  const [markSize, setMarkSize] = useState(208);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useSplashTimeline({
    refs: { cubeMeshRef, cubeMaterialRef, cameraRef, lookAtRef, trailRef, bloomRef },
    curve,
    ready,
    duration,
    onComplete,
    onTitleReveal: () => {
      const camera = cameraRef.current;
      const container = canvasContainerRef.current;
      if (camera && container) {
        const left = new THREE.Vector3(-1.3, 0, 0).project(camera);
        const right = new THREE.Vector3(1.3, 0, 0).project(camera);
        setMarkSize((right.x - left.x) * container.getBoundingClientRect().width / 2);
      }
      setShowTitle(true);
    },
  });

  return (
    <div
      className={`intro-splash fixed inset-0 z-[200] h-dvh w-screen transition-colors duration-500 ${showTitle ? "bg-transparent" : "bg-[#080809]"}`}
      role="dialog"
      aria-label="YKイントロアニメーション"
    >
      <div ref={canvasContainerRef} aria-hidden="true" className={`absolute inset-0 transition-opacity duration-150 ${showTitle ? "opacity-0" : "opacity-100"}`}>
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
      </div>
      {showTitle && <TitleText sourceSize={markSize} />}
      <button
        type="button"
        onClick={onComplete}
        className="absolute right-5 top-5 min-h-11 rounded-full border border-white/25 bg-black/20 px-4 text-xs font-medium tracking-[0.08em] text-white/80 transition hover:border-white/50 hover:text-white sm:right-8 sm:top-8"
      >
        スキップ
      </button>
    </div>
  );
}
