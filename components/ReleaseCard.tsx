"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Changelog } from "@/lib/types";
import { anchorForTag, countVisibleItems, formatDate } from "@/lib/utils";
import { SectionList } from "@/components/SectionList";

type ReleaseCardProps = {
  changelog: Changelog;
  isLatest?: boolean;
};

export function ReleaseCard({ changelog, isLatest }: ReleaseCardProps) {
  const tag = changelog.tag ?? "latest";
  const displayTag = tag.toLowerCase() === "latest" ? "latest" : tag;
  const anchor = anchorForTag(changelog.tag);
  const readableDate = formatDate(changelog.released_at);
  const changeCount = useMemo(() => countVisibleItems(changelog.sections), [
    changelog.sections,
  ]);
  const defaultOpen = isLatest ? true : changeCount <= 4;
  const [open, setOpen] = useState(defaultOpen);

  const changeCountLabel = `${changeCount} ${changeCount === 1 ? "change" : "changes"}`;

  return (
    <div
      id={anchor}
      aria-labelledby={`release-${anchor}-title`}
      className="space-y-5 rounded-2xl border border-[#161b24] bg-[#0a0d13] px-5 py-5 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-controls={`release-${anchor}-content`}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-3 rounded-2xl bg-transparent p-0 text-left outline-none transition-none hover:bg-transparent focus-visible:outline-none"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <h2
            id={`release-${anchor}-title`}
            className="text-xl font-medium text-white"
          >
            <a href={`#${anchor}`} className="transition-colors hover:text-white/70">
              {displayTag}
            </a>
          </h2>
          {isLatest ? (
            <Badge className="rounded-full border border-white/20 bg-white/95 px-3 py-1 text-xs font-medium text-black">
              Latest
            </Badge>
          ) : null}
          {readableDate ? (
            <span className="flex items-center gap-2 text-sm font-medium text-white/60">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span>{readableDate}</span>
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-white/60">
          {changeCountLabel}
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </div>
      </button>
      {open ? (
        <div id={`release-${anchor}-content`} className="space-y-3.5">
          <div className="h-px w-full bg-white/12" aria-hidden />
          {changeCount > 0 ? (
            <SectionList sections={changelog.sections} />
          ) : (
            <p className="text-sm text-white/60">
              No public changes were recorded for this release.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
