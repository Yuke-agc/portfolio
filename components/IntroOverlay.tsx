"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { profile } from "@/lib/constants/profile";
import { INTRO_STORAGE_KEY } from "@/lib/constants/intro";
import { IntroContext } from "@/lib/intro-context";

// ロール(700ms) → 展開(500ms、ここまでで1200ms) → 飛行/ワイプ/走査線(600ms) = 合計1800ms
// （globals.css の各キーフレーム・トランジションと一致させること）
const FLIGHT_START_MS = 1200;
const INTRO_DURATION_MS = 1800;

type IntroOverlayProps = {
  children: ReactNode;
};

/**
 * トップページ表示前のイントロ（起動画面）演出。
 *
 * 初期描画は常にイントロ表示ありの状態で統一し（SSR/クライアントの不整合を避けるため）、
 * マウント後に sessionStorage / prefers-reduced-motion を見て即座にスキップするか判定する。
 * 本編のコンテンツ（children）は常にオーバーレイの下に DOM として存在させる。
 *
 * キューブは展開後、Heroのロゴ位置（Hero 側から渡される logoSlotRef）へ
 * FLIP 方式（left/top ではなく transform の translate+scale）で飛行して着地する。
 * 飛行レイヤーはワイプでクリップされる背景幕とは別の独立した fixed レイヤーにし、
 * ワイプの進行中もキューブ自身は見え続けるようにしている。
 */
export function IntroOverlay({ children }: IntroOverlayProps) {
  const [introDone, setIntroDone] = useState(false);
  const [flightTransform, setFlightTransform] = useState<string | undefined>(
    undefined
  );
  const finishedRef = useRef(false);
  const logoSlotRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const cubeSizeRef = useRef<number | null>(null);

  // 飛行先（ヘッダーのロゴ領域）の座標と、飛行元（fixed レイヤーの中心 = キューブの
  // 現在位置）の座標から transform を算出する。移動元を「変形後のキューブ自身」ではなく
  // 常に fixed レイヤーの中心として扱うことで、リサイズ時に再計算しても値が
  // 複合してずれることがない
  const computeFlightTransform = useCallback(() => {
    const slot = logoSlotRef.current;
    const flight = flightRef.current;
    const cubeSize = cubeSizeRef.current;
    if (!slot || !flight || !cubeSize) return undefined;

    const target = slot.getBoundingClientRect();
    const from = flight.getBoundingClientRect();

    const scale = target.width / cubeSize;
    const dx = target.left + target.width / 2 - (from.left + from.width / 2);
    const dy = target.top + target.height / 2 - (from.top + from.height / 2);

    // translate を先に、scale を後に書くことで、拡縮が移動量に掛からないようにする
    return `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
  }, []);

  useEffect(() => {
    let prefersReducedMotion = false;
    let alreadyShown = false;

    try {
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    } catch {
      // matchMedia が使えない環境ではアニメーションなし扱いにする
      prefersReducedMotion = true;
    }

    try {
      alreadyShown = sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
    } catch {
      // sessionStorage が使えない環境（プライベートモード等）では毎回スキップ扱いにする
      alreadyShown = true;
    }

    if (prefersReducedMotion || alreadyShown) {
      // setState をエフェクト内で直接同期呼び出ししないよう、マイクロタスクに逃がす
      queueMicrotask(() => setIntroDone(true));
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // 保存に失敗しても演出自体は完了させる
      }
      document.body.style.overflow = previousOverflow;
      setIntroDone(true);
    };

    // 展開が終わるタイミング（1200ms）でキューブの実測サイズを記録し、
    // ヘッダーのロゴ位置へ向けた飛行 transform を発火させる
    const startFlight = () => {
      const cube = cubeRef.current;
      if (cube) {
        cubeSizeRef.current = cube.getBoundingClientRect().width;
      }
      setFlightTransform(computeFlightTransform());
    };

    // 飛行開始後にリサイズされても着地位置がずれないよう追従させる
    const handleResize = () => {
      setFlightTransform((prev) =>
        prev === undefined ? prev : computeFlightTransform()
      );
    };

    const flightTimer = window.setTimeout(startFlight, FLIGHT_START_MS);
    const finishTimer = window.setTimeout(finish, INTRO_DURATION_MS);
    window.addEventListener("pointerdown", finish);
    window.addEventListener("keydown", finish);
    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(flightTimer);
      window.clearTimeout(finishTimer);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = previousOverflow;
    };
  }, [computeFlightTransform]);

  const contextValue = useMemo(
    () => ({ introDone, logoSlotRef }),
    [introDone]
  );

  return (
    <IntroContext.Provider value={contextValue}>
      {/* JS無効時は introDone が永久に false のままになり、オーバーレイが
          ページ全体を覆い続けてしまう。noscript で確実に非表示にする */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>.intro-overlay,.intro-flight{display:none !important}</style>",
        }}
      />
      {!introDone && (
        <>
          {/* ワイプでクリップされる背景幕。走査線もこの中で一緒にワイプされる */}
          <div aria-hidden="true" className="intro-overlay">
            <div className="intro-scan-line" />
          </div>

          {/* クリップされない飛行レイヤー。ワイプが進んでもキューブは見え続け、
              ヘッダーのロゴ位置へ transform で移動して着地する */}
          <div aria-hidden="true" ref={flightRef} className="intro-flight">
            <div
              className="intro-flight-inner"
              style={{ transform: flightTransform }}
            >
              <div className="intro-stage">
                <div ref={cubeRef} className="intro-cube">
                  <div className="intro-cube-face intro-cube-face--front">
                    <span className="intro-mark">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                  <div className="intro-cube-face intro-cube-face--back" />
                  <div className="intro-cube-face intro-cube-face--right" />
                  <div className="intro-cube-face intro-cube-face--left" />
                  <div className="intro-cube-face intro-cube-face--top" />
                  <div className="intro-cube-face intro-cube-face--bottom" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {children}
    </IntroContext.Provider>
  );
}
