export type Work = {
  slug: string;
  title: string;
  description: string;
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
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    url: "https://yohaku-one.vercel.app/",
  },
];
