export type Profile = {
  name: string;
  /** meta description / OG画像用の短い説明。既存のまま維持 */
  tagline: string;
  /** 肩書き。HeroのH1の下に表示 */
  title: string;
  /** Heroの価値提案本文 */
  valueProposition: string;
  /** 現在取り組んでいるプロジェクト名（「Now building: 」に続けて表示） */
  nowBuilding: string;
  /**
   * 補助CTA（mailto）の送信先。bot収集対策のため @ の前後で分割して保持し、
   * クライアント側JSで組み立てる（MailtoLink参照）
   */
  contactEmailUser: string;
  contactEmailDomain: string;
};

/** ヘッダーの header-logo で使う短縮マーク */
export const BRAND_MARK = "YK";

export const profile: Profile = {
  name: "ゆけ",
  tagline: "エンジニア。個人開発でWebサービスをつくっています。",
  title: "Product Engineer",
  valueProposition:
    "余計なノイズを減らし、人の言葉が残るWebサービスを設計・実装しています。",
  nowBuilding: "YOHAKU",
  contactEmailUser: "yuke.agc",
  contactEmailDomain: "gmail.com",
};
