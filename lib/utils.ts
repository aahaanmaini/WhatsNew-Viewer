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
  variant?: "default" | "outline" | "secondary" | "destructive";
  className?: string;
  icon?: LucideIcon;
  hidden?: boolean;
};

const CHANGE_CLASS_META: Record<ChangeClass, ChangeClassMeta> = {
  feature: {
    label: "Feature",
    className: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
    icon: PlusCircle,
  },
  fix: {
    label: "Fix",
    className: "border-sky-500/50 bg-sky-500/10 text-sky-300",
    icon: Wrench,
  },
  perf: {
    label: "Improvement",
    className: "border-amber-500/50 bg-amber-500/10 text-amber-300",
    icon: Sparkles,
  },
  docs: {
    label: "Docs",
    className: "border-slate-600/60 bg-slate-600/10 text-slate-300",
    icon: BookOpen,
  },
  security: {
    label: "Security",
    className: "border-rose-500/60 bg-rose-500/10 text-rose-300",
    icon: ShieldCheck,
  },
  breaking: {
    label: "Breaking",
    variant: "outline",
    className: "border-rose-500 text-rose-300",
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

export function countVisibleItems(sections: Section[]) {
  return sections.reduce((total, section) => {
    const visible = section.items.filter((item) => !getClassMeta(item.class)?.hidden);
    return total + visible.length;
  }, 0);
}

export function visibleSections(sections: Section[]) {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !getClassMeta(item.class)?.hidden),
    }))
    .filter((section) => section.items.length > 0);
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
  } satisfies CSSProperties;
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
