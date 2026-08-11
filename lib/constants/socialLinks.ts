import type { ComponentType } from "react";
import { NotebookText } from "lucide-react";
import { GitHubIcon, XIcon } from "@/components/icons";

export type SocialLink = {
  name: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
};

export const socialLinks: SocialLink[] = [
  {
    name: "X",
    url: "https://x.com/Yuke_agc",
    icon: XIcon,
  },
  {
    name: "Qiita",
    url: "https://qiita.com/Yuke-agc",
    icon: NotebookText,
  },
  {
    name: "GitHub",
    url: "https://github.com/Yuke-agc",
    icon: GitHubIcon,
  },
];
