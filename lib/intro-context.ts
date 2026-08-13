"use client";

import { createContext, useContext, type RefObject } from "react";

type IntroContextValue = {
  /** イントロ演出が完了したかどうか */
  introDone: boolean;
  /**
   * ヘッダー側のロゴ領域への ref。イントロのキューブが着地先の座標を
   * getBoundingClientRect() で測るために Header から渡される
   */
  logoSlotRef: RefObject<HTMLDivElement | null> | null;
};

/**
 * Provider がない場合は introDone: true（イントロなしとして扱い、
 * Header 等のアニメーションを即座に開始する）
 */
export const IntroContext = createContext<IntroContextValue>({
  introDone: true,
  logoSlotRef: null,
});

export function useIntroDone() {
  return useContext(IntroContext).introDone;
}

export function useIntroLogoSlot() {
  return useContext(IntroContext).logoSlotRef;
}
