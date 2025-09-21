import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <header className="space-y-6 text-foreground" aria-labelledby="page-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {logo ? (
            <Image
              src={logo}
              alt={getDefaultRepoTitle(owner, repo, title)}
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12 rounded-full border border-border/60 bg-card object-cover"
            />
          ) : null}
          <div>
            <p className="text-sm uppercase tracking-[0.3rem] text-muted-foreground">
              {getDefaultRepoTitle(owner, repo)}
            </p>
            <h1
              id="page-title"
              className="text-4xl font-semibold tracking-tight text-[color:var(--wn-accent)]"
            >
              {title}
            </h1>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-[color:var(--wn-accent)] text-[color:var(--wn-accent)] hover:bg-[color:var(--wn-accent)] hover:text-background"
        >
          <a href={repoUrl} target="_blank" rel="noreferrer">
            <Github className="size-4" aria-hidden="true" />
            View on GitHub
          </a>
        </Button>
      </div>
      {intro ? (
        <div className="markdown-content text-base text-muted-foreground" data-testid="intro">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{intro}</ReactMarkdown>
        </div>
      ) : (
        <p className="max-w-2xl text-base text-muted-foreground">
          Track the evolution of this project. Stay updated with the latest
          features, improvements, and fixes across releases.
        </p>
      )}
    </header>
  );
}
