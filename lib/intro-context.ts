"use client";

import { createContext, useContext } from "react";

type IntroContextValue = {
  /** イントロ演出が完了したかどうか */
  introDone: boolean;
};

/**
 * Provider がない場合は introDone: true（イントロなしとして扱い、
 * Hero 等のアニメーションを即座に開始する）
 */
export const IntroContext = createContext<IntroContextValue>({
  introDone: true,
});

export function useIntroDone() {
  return useContext(IntroContext).introDone;
}
