import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorNoticeProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export function ErrorNotice({
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: ErrorNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/20 p-6 text-sm text-muted-foreground",
        className,
      )}
    >
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="mt-2 text-muted-foreground">{description}</p>
      ) : null}
      {actionHref && actionLabel ? (
        <Button
          asChild
          variant="outline"
          className="mt-4 border-[color:var(--wn-accent)] text-[color:var(--wn-accent)] hover:bg-[color:var(--wn-accent)] hover:text-background"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
