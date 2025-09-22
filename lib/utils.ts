import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  Circle,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { ChangeClass, Section } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ChangeClassMeta = {
  label: string;
  icon?: LucideIcon;
  hidden?: boolean;
  badgeVariant?: "default" | "outline" | "secondary" | "destructive";
  badgeClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
};

const CHANGE_CLASS_META: Record<ChangeClass, ChangeClassMeta> = {
  feature: {
    label: "Feature",
    badgeVariant: "outline",
    badgeClassName:
      "border border-[#1f4f31] bg-[#14261c] text-[#4ade80]",
    iconWrapperClassName: "bg-[#173421] text-[#4ade80]",
    iconClassName: "text-[#4ade80]",
    icon: PlusCircle,
  },
  fix: {
    label: "Fix",
    badgeVariant: "outline",
    badgeClassName:
      "border border-[#154157] bg-[#10222f] text-[#38bdf8]",
    iconWrapperClassName: "bg-[#102d3d] text-[#38bdf8]",
    iconClassName: "text-[#38bdf8]",
    icon: Wrench,
  },
  perf: {
    label: "Improvement",
    badgeVariant: "outline",
    badgeClassName:
      "border border-[#4d3a0f] bg-[#2c210c] text-[#facc15]",
    iconWrapperClassName: "bg-[#35260c] text-[#facc15]",
    iconClassName: "text-[#facc15]",
    icon: Sparkles,
  },
  docs: {
    label: "Docs",
    badgeVariant: "outline",
    badgeClassName:
      "border border-[#2c3444] bg-[#1b202c] text-[#cbd5f5]",
    iconWrapperClassName: "bg-[#1e2532] text-[#cbd5f5]",
    iconClassName: "text-[#cbd5f5]",
    icon: BookOpen,
  },
  security: {
    label: "Security",
    badgeVariant: "outline",
    badgeClassName:
      "border border-[#3f1420] bg-[#281018] text-[#fda4af]",
    iconWrapperClassName: "bg-[#2e121b] text-[#fda4af]",
    iconClassName: "text-[#fda4af]",
    icon: ShieldCheck,
  },
  breaking: {
    label: "Breaking",
    badgeVariant: "outline",
    badgeClassName: "text-rose-300 border border-rose-500",
    iconWrapperClassName:
      "border border-rose-500 bg-rose-500/20 text-rose-200",
    iconClassName: "text-rose-200",
    icon: AlertTriangle,
  },
  internal: {
    label: "Internal",
    hidden: true,
    icon: Circle,
  },
};

export function getClassMeta(changeClass?: ChangeClass | null) {
  if (!changeClass) {
    return undefined;
  }

  return CHANGE_CLASS_META[changeClass];
}

export function formatDate(date?: string) {
  if (!date) {
    return null;
  }

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(value);
}

export function countVisibleItems(sections: Section[] | null | undefined) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return 0;
  }

  return sections.reduce((total, section) => {
    const items = Array.isArray(section.items) ? section.items : [];
    const visible = items.filter((item) => !getClassMeta(item.class)?.hidden);
    return total + visible.length;
  }, 0);
}

export function anchorForTag(tag?: string) {
  if (!tag) {
    return "latest";
  }

  return tag
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function applyAccentStyle(accent?: string): CSSProperties | undefined {
  if (!accent) {
    return undefined;
  }

  return {
    "--wn-accent": accent,
  } as CSSProperties;
}

export function getDefaultRepoTitle(owner: string, repo: string, fallback?: string) {
  if (fallback) {
    return fallback;
  }

  return `${owner}/${repo}`;
}

export function changeIcon(changeClass?: ChangeClass | null): LucideIcon {
  const meta = getClassMeta(changeClass);
  return meta?.icon ?? Circle;
}

const SECTION_CLASS_ALIASES: Array<{ match: RegExp; value: ChangeClass }> = [
  { match: /feature/i, value: "feature" },
  { match: /(bug|fix)/i, value: "fix" },
  { match: /(perf|improve|speed|optimi[sz]e)/i, value: "perf" },
  { match: /doc/i, value: "docs" },
  { match: /security/i, value: "security" },
  { match: /break/i, value: "breaking" },
  { match: /internal/i, value: "internal" },
];

export function inferChangeClass(
  title?: string,
  fallback?: ChangeClass | null,
): ChangeClass | undefined {
  if (fallback) {
    return fallback;
  }
  if (!title) {
    return undefined;
  }

  const alias = SECTION_CLASS_ALIASES.find((entry) => entry.match.test(title));
  return alias?.value;
}
