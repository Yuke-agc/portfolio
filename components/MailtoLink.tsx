"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MailtoLinkProps = {
  /** メールアドレスの @ より前の部分 */
  user: string;
  /** メールアドレスの @ より後の部分 */
  domain: string;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
};

/**
 * メールアドレスをHTMLソースに平文で出さないための mailto リンク。
 * ユーザー名部分とドメイン部分を分けて受け取り、マウント後（および念のためクリック時）に
 * JSで結合して href へ反映する。サーバーHTML・クライアント初回描画では href="#" のまま
 * 変えないため、hydration ミスマッチは発生しない（href の書き換えは初回描画後の
 * useEffect / onClick 内での直接のDOM操作であり、Reactの差分比較の対象にならない）。
 */
export function MailtoLink({
  user,
  domain,
  children,
  className,
  ariaLabel,
}: MailtoLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;
    link.href = `mailto:${user}@${domain}`;
  }, [user, domain]);

  const handleClick = () => {
    const link = linkRef.current;
    if (link) link.href = `mailto:${user}@${domain}`;
  };

  return (
    <a
      ref={linkRef}
      href="#"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}
