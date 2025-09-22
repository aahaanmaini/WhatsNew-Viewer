import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Github } from "lucide-react";

import type { SiteCfg } from "@/lib/types";
import { getDefaultRepoTitle } from "@/lib/utils";

type HeaderProps = {
  owner: string;
  repo: string;
  siteConfig?: SiteCfg | null;
};

export function Header({ owner, repo, siteConfig }: HeaderProps) {
  const title = siteConfig?.title ?? "Changelog";
  const intro = siteConfig?.intro_markdown;
  const logo = siteConfig?.logo;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  return (
    <header className="space-y-7 text-white" aria-labelledby="page-title">
      <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-6">
          {logo ? (
            <Image
              src={logo}
              alt={getDefaultRepoTitle(owner, repo, title)}
              width={56}
              height={56}
              unoptimized
              className="h-16 w-16 rounded-full border border-white/15 bg-black/40 object-cover"
            />
          ) : null}
          <div className="space-y-3">
            <p className="text-lg font-semibold text-white/75">
              {owner} / {repo}
            </p>
            <h1
              id="page-title"
              className="text-5xl font-light tracking-[-0.02em] text-white sm:text-[56px]"
            >
              What&apos;s New?
            </h1>
            {intro ? null : (
              <p className="max-w-2xl text-base leading-7 text-white/60">
                A changelog for this project. Stay updated with the latest
                features, improvements, and fixes across releases.
              </p>
            )}
          </div>
        </div>
        <Link
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-base font-medium text-white/70 transition-colors hover:text-white whitespace-nowrap"
        >
          <Github className="size-5" aria-hidden="true" />
          View on GitHub
        </Link>
      </div>
      {intro ? (
        <div className="markdown-content text-base leading-7 text-white/60" data-testid="intro">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro}</ReactMarkdown>
        </div>
      ) : null}
    </header>
  );
}
