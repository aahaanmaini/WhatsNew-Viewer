import type { Changelog, SiteCfg } from "@/lib/types";

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
): Promise<Changelog | null> {
  return fetchJson<Changelog>(
    ghRaw(owner, repo, "data", "releases", `${tag}.json`),
  );
}

export async function fetchSiteConfig(
  owner: string,
  repo: string,
): Promise<SiteCfg | null> {
  return fetchJson<SiteCfg>(ghRaw(owner, repo, "data/site.config.json"));
}

type ReleaseIndex = string[] | { tags?: string[] } | null;

function normalizeReleaseIndex(data: ReleaseIndex): string[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter((entry): entry is string => typeof entry === "string");
  }
  if (Array.isArray(data.tags)) {
    return data.tags.filter((entry): entry is string => typeof entry === "string");
  }
  return [];
}

export async function fetchReleaseTags(
  owner: string,
  repo: string,
): Promise<string[]> {
  const indexUrls = [
    ghRaw(owner, repo, "data/releases/index.json"),
    ghRaw(owner, repo, "data/releases.json"),
  ];

  for (const url of indexUrls) {
    const index = await fetchJson<ReleaseIndex>(url).catch(() => null);
    const tags = normalizeReleaseIndex(index);
    if (tags.length) {
      return tags;
    }
  }

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
