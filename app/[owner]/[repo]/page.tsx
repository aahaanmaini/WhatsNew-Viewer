import { Header } from "@/components/Header";
import { ReleaseCard } from "@/components/ReleaseCard";
import { ErrorNotice } from "@/components/ErrorNotice";
import {
  fetchLatestChangelog,
  fetchReleaseChangelog,
  fetchReleaseIndex,
  fetchSiteConfig,
  type FetchError,
} from "@/lib/fetch";
import { applyAccentStyle } from "@/lib/utils";
import type { Changelog, ReleaseIndexEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

type ReleaseWithMeta = {
  changelog: Changelog;
  label?: string;
  entry?: ReleaseIndexEntry;
};

async function loadData(owner: string, repo: string) {
  try {
    const [latest, siteConfig, releaseEntries] = await Promise.all([
      fetchLatestChangelog(owner, repo),
      fetchSiteConfig(owner, repo),
      fetchReleaseIndex(owner, repo),
    ]);

    const latestEntry = latest?.tag
      ? releaseEntries.find((entry) => entry.tag === latest.tag)
      : undefined;

    const remainingEntries = latestEntry
      ? releaseEntries.filter((entry) => entry.tag !== latestEntry.tag)
      : releaseEntries;

    const releasesRaw = await Promise.all(
      remainingEntries.map(async (entry) => {
        const release = await fetchReleaseChangelog(owner, repo, entry.tag, entry.path);
        if (!release) return null;

        return {
          changelog: release,
          label: entry.label ?? entry.tag,
          entry,
        } satisfies ReleaseWithMeta;
      }),
    );

    const releases = releasesRaw.filter(
      (item): item is ReleaseWithMeta => Boolean(item?.changelog),
    );

    const latestLabel =
      latest?.label ?? latestEntry?.label ?? latestEntry?.tag ?? latest?.tag ?? "Latest";

    return {
      latest,
      latestLabel,
      siteConfig,
      releases,
      error: null as FetchError | null,
    };
  } catch (error) {
    return {
      latest: null,
      latestLabel: "Latest",
      siteConfig: null,
      releases: [] as ReleaseWithMeta[],
      error: error as FetchError,
    };
  }
}

export default async function RepoLatestPage({ params }: PageProps) {
  const resolvedParams = await params;
  const owner = decodeURIComponent(resolvedParams.owner);
  const repo = decodeURIComponent(resolvedParams.repo);
  const { latest, latestLabel, siteConfig, releases = [], error } = await loadData(owner, repo);

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
          <ReleaseCard changelog={latest} isLatest label={latestLabel} />
          {releases.length ? (
            <div className="space-y-8">
              {releases.map(({ changelog, label }) => (
                <ReleaseCard
                  key={changelog.tag ?? `${changelog.repo}-${label ?? changelog.label ?? "release"}`}
                  changelog={changelog}
                  label={label ?? changelog.label ?? changelog.tag}
                />
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
