import { Badge } from "@/components/ui/badge";
import type { ChangeClass } from "@/lib/types";
import { cn, getClassMeta } from "@/lib/utils";

type BadgeForClassProps = {
  changeClass?: ChangeClass | null;
  className?: string;
};

export function BadgeForClass({ changeClass, className }: BadgeForClassProps) {
  const meta = getClassMeta(changeClass);

  if (!meta || meta.hidden) {
    return null;
  }

  return (
    <Badge
      variant={meta.variant ?? "outline"}
      className={cn("uppercase tracking-wide", meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}
