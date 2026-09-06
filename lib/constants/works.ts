export type Work = {
  slug: string;
  title: string;
  description: string;
  intent: string;
  decisions: string[];
  tags: string[];
  url: string;
  /** 未設定の場合はプレースホルダーを表示 */
  imagePath?: string;
};

export const works: Work[] = [
  {
    slug: "yohaku",
    title: "余白 | YOHAKU",
    description:
      "数字を見ない。名前を持たず、言葉だけを残す。\nいいね・閲覧数・ランキングを一切表示しない匿名投稿サイト。",
    intent:
      "評価の数字やプロフィールを取り除き、投稿された言葉そのものに向き合える余白を設計しました。",
    decisions: [
      "いいね・閲覧数・ランキングを表示しない",
      "名前を持たない投稿設計",
      "言葉を主役にする静かなインターフェース",
    ],
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    url: "https://yohaku-one.vercel.app/",
  },
];
