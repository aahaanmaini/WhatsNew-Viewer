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
        "rounded-2xl border border-white/10 bg-[#10141b] p-6 text-sm text-white/70",
        className,
      )}
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description ? <p className="mt-2 text-white/60">{description}</p> : null}
      {actionHref && actionLabel ? (
        <Button
          asChild
          variant="outline"
          className="mt-4 border-white/20 text-white hover:bg-white hover:text-black"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
