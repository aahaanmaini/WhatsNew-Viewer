import { Header } from "@/components/Header";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ErrorNotice } from "@/components/ErrorNotice";
import {
  fetchLatestChangelog,
  fetchSiteConfig,
  type FetchError,
} from "@/lib/fetch";
import { applyAccentStyle } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

async function loadData(owner: string, repo: string) {
  try {
    const [latest, siteConfig] = await Promise.all([
      fetchLatestChangelog(owner, repo),
      fetchSiteConfig(owner, repo),
    ]);

    return { latest, siteConfig, error: null as FetchError | null };
  } catch (error) {
    return {
      latest: null,
      siteConfig: null,
      error: error as FetchError,
    };
  }
}

export default async function RepoLatestPage({ params }: PageProps) {
  const resolvedParams = await params;
  const owner = decodeURIComponent(resolvedParams.owner);
  const repo = decodeURIComponent(resolvedParams.repo);
  const { latest, siteConfig, error } = await loadData(owner, repo);

  const accentStyle = applyAccentStyle(siteConfig?.accent);

  return (
    <main
      className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12"
      style={accentStyle}
    >
      <Header owner={owner} repo={repo} siteConfig={siteConfig} />
      {error ? (
        <ErrorNotice
          title="We couldn’t load the latest changelog."
          description={
            error.status === 403
              ? "GitHub rate limits may have been hit. Try again in a few minutes."
              : "Check that the repository publishes data/latest.json to the gh-pages branch."
          }
        />
      ) : latest ? (
        <ReleaseCard changelog={latest} isLatest />
      ) : (
        <ErrorNotice
          title="No changelog found for this repo."
          description="Verify that data/latest.json exists on the gh-pages branch."
        />
      )}
    </main>
  );
}
