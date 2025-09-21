"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ListChecks } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Changelog } from "@/lib/types";
import { anchorForTag, countVisibleItems, formatDate } from "@/lib/utils";
import { SectionList } from "@/components/SectionList";

type ReleaseCardProps = {
  changelog: Changelog;
  isLatest?: boolean;
};

export function ReleaseCard({ changelog, isLatest }: ReleaseCardProps) {
  const tag = changelog.tag ?? "latest";
  const anchor = anchorForTag(changelog.tag);
  const readableDate = formatDate(changelog.released_at);
  const changeCount = useMemo(() => countVisibleItems(changelog.sections), [
    changelog.sections,
  ]);
  const defaultOpen = changeCount <= 4;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card
      id={anchor}
      className="border-border/60 bg-card/30 backdrop-blur-sm"
      aria-labelledby={`release-${anchor}-title`}
    >
      <CardHeader className="gap-4 pb-0">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle
            id={`release-${anchor}-title`}
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            <a
              href={`#${anchor}`}
              className="hover:text-[color:var(--wn-accent)] hover:underline"
            >
              {tag}
            </a>
          </CardTitle>
          {isLatest ? (
            <Badge className="border-[color:var(--wn-accent)] bg-[color:var(--wn-accent)]/10 text-[color:var(--wn-accent)]">
              Latest
            </Badge>
          ) : null}
        </div>
        {readableDate ? (
          <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            {readableDate}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="px-6 pt-4">
        <Accordion
          type="single"
          collapsible
          value={open ? "details" : undefined}
          onValueChange={(value) => setOpen(value === "details")}
        >
          <AccordionItem
            value="details"
            className="rounded-lg border border-border/40 bg-background/20 px-4"
          >
            <AccordionTrigger className="gap-3 py-4 text-sm font-medium text-muted-foreground hover:no-underline">
              <span className="flex items-center gap-2 text-muted-foreground">
                <ListChecks className="size-4" aria-hidden="true" />
                {changeCount} {changeCount === 1 ? "change" : "changes"}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-6">
              {changeCount > 0 ? (
                <div className="pt-4">
                  <SectionList sections={changelog.sections} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No public changes were recorded for this release.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
