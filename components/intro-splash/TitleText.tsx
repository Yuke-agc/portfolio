import { motion } from "framer-motion";

type TitleTextProps = {
  title: string;
  visible: boolean;
};

const variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

/**
 * ロゴ下のタイトル文字。visible は useSplashTimeline から一度だけ true に
 * 切り替わる（毎フレーム更新ではない）ため、React の再レンダーコストは無視できる。
 */
export function TitleText({ title, visible }: TitleTextProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-[18%] flex justify-center"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-sm font-medium uppercase tracking-[0.35em] text-[#e9d9ff]">
        {title}
      </span>
    </motion.div>
  );
}
