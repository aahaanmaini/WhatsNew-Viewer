import { Header } from "@/components/Header";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ErrorNotice } from "@/components/ErrorNotice";
import {
  fetchLatestChangelog,
  fetchReleaseChangelog,
  fetchReleaseTags,
  fetchSiteConfig,
  type FetchError,
} from "@/lib/fetch";
import { applyAccentStyle } from "@/lib/utils";
import type { Changelog } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

async function loadData(owner: string, repo: string) {
  try {
    const [latest, siteConfig, releaseTags] = await Promise.all([
      fetchLatestChangelog(owner, repo),
      fetchSiteConfig(owner, repo),
      fetchReleaseTags(owner, repo),
    ]);

    const tagsToFetch = releaseTags.filter((tag) => tag);

    const latestTag = latest?.tag?.toLowerCase();
    const additionalTags = latestTag
      ? tagsToFetch.filter((tag) => tag.toLowerCase() !== latestTag)
      : tagsToFetch;

    const releasesRaw = await Promise.all(
      additionalTags.map(async (tag) => {
        try {
          const release = await fetchReleaseChangelog(owner, repo, tag);
          return release;
        } catch {
          return null;
        }
      }),
    );

    const releases = releasesRaw
      .filter((release): release is NonNullable<typeof release> => Boolean(release))
      .sort((a, b) => {
        const first = a.released_at ? new Date(a.released_at).getTime() : Number.NEGATIVE_INFINITY;
        const second = b.released_at ? new Date(b.released_at).getTime() : Number.NEGATIVE_INFINITY;

        if (Number.isFinite(first) && Number.isFinite(second)) {
          return second - first;
        }

        return additionalTags.indexOf(a.tag ?? "") - additionalTags.indexOf(b.tag ?? "");
      });

    return { latest, siteConfig, releases, error: null as FetchError | null };
  } catch (error) {
    return {
      latest: null,
      siteConfig: null,
      releases: [] as Changelog[],
      error: error as FetchError,
    };
  }
}

export default async function RepoLatestPage({ params }: PageProps) {
  const resolvedParams = await params;
  const owner = decodeURIComponent(resolvedParams.owner);
  const repo = decodeURIComponent(resolvedParams.repo);
  const { latest, siteConfig, releases = [], error } = await loadData(owner, repo);

  const accentStyle = applyAccentStyle(siteConfig?.accent);

  return (
    <main
      className="mx-auto flex w-full max-w-4xl flex-col gap-10"
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
        <div className="space-y-8">
          <ReleaseCard changelog={latest} isLatest />
          {releases.length ? (
            <div className="space-y-8">
              {releases.map((release) => (
                <ReleaseCard key={release.tag ?? release.repo} changelog={release} />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <ErrorNotice
          title="No changelog found for this repo."
          description="Verify that data/latest.json exists on the gh-pages branch."
        />
      )}
    </main>
  );
}
