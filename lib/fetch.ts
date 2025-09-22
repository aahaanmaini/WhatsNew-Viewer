import type {
  Changelog,
  ReleaseIndexEntry,
  SiteCfg,
} from "@/lib/types";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com";

export type FetchError = {
  status: number;
  message: string;
  url: string;
};

export function ghRaw(
  owner: string,
  repo: string,
  ...segments: Array<string | undefined>
) {
  const path = segments
    .filter(Boolean)
    .join("/")
    .replace(/^\/+/, "");

  return `${GITHUB_RAW_BASE}/${owner}/${repo}/gh-pages/${path}`;
}

async function request(url: string, init?: RequestInit) {
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        "User-Agent": "whatsnew-site",
        ...(init?.headers || {}),
      },
      // Ensure we always serve the latest published changelog.
      cache: "no-store",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach GitHub";
    const fetchError: FetchError = {
      status: 0,
      message,
      url,
    };

    throw fetchError;
  }

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    const error: FetchError = {
      status: response.status,
      message: response.statusText,
      url,
    };

    throw error;
  }

  return response.json();
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T | null> {
  const data = await request(url, init);
  return data as T | null;
}

export async function fetchLatestChangelog(
  owner: string,
  repo: string,
): Promise<Changelog | null> {
  return fetchJson<Changelog>(ghRaw(owner, repo, "data/latest.json"));
}

export async function fetchReleaseChangelog(
  owner: string,
  repo: string,
  tag: string,
  path?: string,
): Promise<Changelog | null> {
  const target = path
    ? ghRaw(owner, repo, path)
    : ghRaw(owner, repo, "data", "releases", `${tag}.json`);

  return fetchJson<Changelog>(target);
}

export async function fetchSiteConfig(
  owner: string,
  repo: string,
): Promise<SiteCfg | null> {
  return fetchJson<SiteCfg>(ghRaw(owner, repo, "data/site.config.json"));
}

type ReleaseIndexRaw = Array<Record<string, unknown>> | Record<string, unknown> | null;

function normalizeReleaseIndexEntry(entry: Record<string, unknown>): ReleaseIndexEntry | null {
  const tag = typeof entry.tag === "string" ? entry.tag : undefined;
  if (!tag) {
    return null;
  }

  const label = typeof entry.label === "string" && entry.label.trim().length > 0 ? entry.label : undefined;
  const releasedAt = typeof entry.released_at === "string" ? entry.released_at : undefined;
  const path = typeof entry.path === "string" && entry.path.trim().length > 0 ? entry.path : undefined;
  const range = typeof entry.range === "object" && entry.range ? (entry.range as ReleaseIndexEntry["range"]) : undefined;
  const stats = typeof entry.stats === "object" && entry.stats ? (entry.stats as ReleaseIndexEntry["stats"]) : undefined;

  return {
    tag,
    label,
    released_at: releasedAt,
    path,
    range,
    stats,
  };
}

function sortReleaseEntries(entries: ReleaseIndexEntry[]) {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => {
      const timeA = a.entry.released_at ? new Date(a.entry.released_at).getTime() : Number.NaN;
      const timeB = b.entry.released_at ? new Date(b.entry.released_at).getTime() : Number.NaN;

      if (!Number.isNaN(timeA) && !Number.isNaN(timeB)) {
        return timeB - timeA;
      }

      if (!Number.isNaN(timeA)) return -1;
      if (!Number.isNaN(timeB)) return 1;

      return a.index - b.index;
    })
    .map((item) => item.entry);
}

export async function fetchReleaseIndex(
  owner: string,
  repo: string,
): Promise<ReleaseIndexEntry[]> {
  const indexUrls = [
    ghRaw(owner, repo, "data/releases/index.json"),
    ghRaw(owner, repo, "data/releases.json"),
  ];

  for (const url of indexUrls) {
    const raw = await fetchJson<ReleaseIndexRaw>(url).catch(() => null);
    if (!raw) continue;

    const items = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as { releases?: Array<Record<string, unknown>> }).releases)
        ? ((raw as { releases?: Array<Record<string, unknown>> }).releases as Array<Record<string, unknown>>)
        : null;

    if (!items) continue;

    const entries = items
      .map((item) => normalizeReleaseIndexEntry(item))
      .filter((entry): entry is ReleaseIndexEntry => Boolean(entry));

    if (entries.length) {
      return sortReleaseEntries(entries);
    }
  }

  const fallbackTags = await fetchReleaseTagsFromDirectory(owner, repo);
  if (!fallbackTags.length) {
    return [];
  }

  return fallbackTags.map((tag) => ({
    tag,
    label: tag,
    path: `data/releases/${tag}.json`,
  }));
}

async function fetchReleaseTagsFromDirectory(owner: string, repo: string) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/data/releases?ref=gh-pages`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "whatsnew-site",
      },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as Array<{ name: string }>; // rough GitHub schema

    return payload
      .map((entry) => entry.name)
      .filter((name) => name.endsWith(".json"))
      .map((name) => name.replace(/\.json$/i, ""));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to fetch release list", error);
    }
    return [];
  }
}
