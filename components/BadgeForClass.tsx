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
      variant={meta.badgeVariant ?? "secondary"}
      className={cn(
        "rounded-full px-2.5 py-[0.3rem] text-[0.7rem] font-medium",
        meta.badgeClassName,
        className,
      )}
    >
      {meta.label}
    </Badge>
  );
}
