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
  /** 補助CTA（mailto）の送信先 */
  contactEmail: string;
};

export const profile: Profile = {
  name: "ゆけ",
  tagline: "エンジニア。個人開発でWebサービスをつくっています。",
  title: "Product Engineer",
  valueProposition:
    "余計なノイズを減らし、人の言葉が残るWebサービスを設計・実装しています。",
  nowBuilding: "YOHAKU",
  // TODO: 実際の連絡先メールアドレスに差し替える
  contactEmail: "your-email@example.com",
};
