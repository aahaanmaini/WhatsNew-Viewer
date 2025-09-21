import Link from "next/link";

import { Header } from "@/components/Header";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ErrorNotice } from "@/components/ErrorNotice";
import {
  fetchReleaseChangelog,
  fetchSiteConfig,
  type FetchError,
} from "@/lib/fetch";
import { applyAccentStyle } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    owner: string;
    repo: string;
    tag: string;
  };
};

async function loadData(owner: string, repo: string, tag: string) {
  try {
    const [release, siteConfig] = await Promise.all([
      fetchReleaseChangelog(owner, repo, tag),
      fetchSiteConfig(owner, repo),
    ]);

    return { release, siteConfig, error: null as FetchError | null };
  } catch (error) {
    return {
      release: null,
      siteConfig: null,
      error: error as FetchError,
    };
  }
}

export default async function ReleasePage({ params }: PageProps) {
  const owner = decodeURIComponent(params.owner);
  const repo = decodeURIComponent(params.repo);
  const tag = decodeURIComponent(params.tag);
  const { release, siteConfig, error } = await loadData(owner, repo, tag);

  const accentStyle = applyAccentStyle(siteConfig?.accent);

  return (
    <main
      className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12"
      style={accentStyle}
    >
      <Header owner={owner} repo={repo} siteConfig={siteConfig} />
      {error ? (
        <ErrorNotice
          title="We couldn’t load this release."
          description={
            error.status === 404
              ? "The release JSON file was not found on the gh-pages branch."
              : "Unexpected error fetching release data from GitHub."
          }
          actionHref={`/${owner}/${repo}`}
          actionLabel="Back to latest"
        />
      ) : release ? (
        <ReleaseCard changelog={release} />
      ) : (
        <ErrorNotice
          title="Release not found."
          description="We couldn’t find data for this tag on the gh-pages branch."
          actionHref={`/${owner}/${repo}`}
          actionLabel="Back to latest"
        />
      )}
      <Link
        href={`https://github.com/${owner}/${repo}/releases/tag/${encodeURIComponent(tag)}`}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-[color:var(--wn-accent)] hover:underline"
        target="_blank"
      >
        View release on GitHub
      </Link>
    </main>
  );
}
