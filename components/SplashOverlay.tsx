"use client";

/** 開発者向けの静かな起動シーケンス。YKの定着を見せ、すぐに本編へ渡す。 */
import { useEffect, useState } from "react";
import { YkMark } from "./YkMark";

export function SplashOverlay() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const dismiss = () => setVisible(false);
    const timer = window.setTimeout(dismiss, 2700);
    const onKeyDown = (event: KeyboardEvent) => { if (["Enter", "Escape", " "].includes(event.key)) dismiss(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", onKeyDown); };
  }, []);
  if (!visible) return null;
  return <section className="splash-overlay" role="status" aria-label="YUKEのポートフォリオを読み込んでいます" onClick={() => setVisible(false)}>
    <button className="splash-skip" type="button" onClick={() => setVisible(false)}>スキップ <span>↗</span></button>
    <div className="splash-stage" aria-hidden="true"><i className="splash-axis splash-axis--x"/><i className="splash-axis splash-axis--y"/><i className="splash-orbit splash-orbit--a"/><i className="splash-orbit splash-orbit--b"/><i className="splash-tile splash-tile--n"/><i className="splash-tile splash-tile--e"/><i className="splash-tile splash-tile--s"/><i className="splash-tile splash-tile--w"/><div className="splash-logo-tile"><YkMark className="yk-logo--splash"/></div></div>
    <div className="splash-caption"><span>YUKE / 起動シーケンス</span><b>準備中</b></div>
    <div className="splash-meta"><span>考える・設計する・実装する・届ける</span><i/><span>起動完了</span></div>
  </section>;
}
