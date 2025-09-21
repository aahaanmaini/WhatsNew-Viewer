export type ChangeClass =
  | "feature"
  | "fix"
  | "perf"
  | "docs"
  | "security"
  | "breaking"
  | "internal";

export type ChangeItem = {
  summary: string;
  refs?: string[];
  class?: ChangeClass;
};

export type Section = {
  title: string;
  items: ChangeItem[];
};

export type Range = {
  mode: string;
  from?: string;
  to?: string;
};

export type Stats = {
  commits?: number;
  prs?: number;
};

export type Changelog = {
  repo: string;
  tag?: string;
  released_at?: string;
  range: Range;
  stats?: Stats;
  sections: Section[];
};

export type SiteCfg = {
  title?: string;
  logo?: string;
  accent?: string;
  intro_markdown?: string;
};
