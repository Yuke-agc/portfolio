import type { RefObject } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { BloomEffect as PostprocessingBloomEffect } from "postprocessing";

type BloomEffectProps = {
  bloomRef: RefObject<PostprocessingBloomEffect | null>;
};

/**
 * 派手なネオンにならない程度の弱いグローだけを付与する。intensity は
 * useSplashTimeline が「一体化」の瞬間に ref 経由で直接持ち上げる。
 */
export function BloomEffect({ bloomRef }: BloomEffectProps) {
  return (
    <EffectComposer>
      <Bloom
        ref={bloomRef}
        intensity={0.22}
        luminanceThreshold={0.32}
        luminanceSmoothing={0.42}
        mipmapBlur
        radius={0.48}
      />
    </EffectComposer>
  );
}
