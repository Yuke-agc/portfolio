import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/lib/constants/profile";
import { INTRO_STORAGE_KEY } from "@/lib/constants/intro";
import { IntroOverlay } from "@/components/IntroOverlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${profile.name} | Portfolio`;

// デプロイ先が決まったら NEXT_PUBLIC_SITE_URL を設定してください（未設定時は localhost にフォールバック）
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.tagline,
  openGraph: {
    title,
    description: profile.tagline,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.tagline,
  },
};

// イントロ表示済みなら、React のハイドレーション前に <html> へ data-intro-skip="1" を
// 付与する。ブロッキング実行されるため、sessionStorage の読み取りと属性付与のみに留める。
const introSkipCheckScript = `(function(){try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")==="1"){document.documentElement.setAttribute("data-intro-skip","1")}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: introSkipCheckScript }}
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
        <IntroOverlay>{children}</IntroOverlay>
      </body>
    </html>
  );
}
