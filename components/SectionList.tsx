import type { Section } from "@/lib/types";
import { BadgeForClass } from "@/components/BadgeForClass";
import {
  cn,
  changeIcon,
  getClassMeta,
  inferChangeClass,
} from "@/lib/utils";

type SectionListProps = {
  sections: Section[];
};

export function SectionList({ sections }: SectionListProps) {
  const flatItems = sections.flatMap((section) =>
    section.items.map((item, index) => ({
      sectionTitle: section.title,
      index,
      item,
    })),
  );

  const items = flatItems.filter((entry) => {
    const meta = getClassMeta(entry.item.class);
    return !meta?.hidden;
  });

  if (!items.length) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ item, sectionTitle }, idx) => {
        const inferredClass = inferChangeClass(sectionTitle, item.class);
        const Icon = changeIcon(inferredClass);
        const meta = getClassMeta(inferredClass);

        return (
          <li
            key={`change-${idx}`}
            className="flex flex-wrap items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-white/90"
          >
            <div
              className={cn(
                "flex size-[22px] items-center justify-center rounded-full bg-white/5 text-white",
                meta?.iconWrapperClassName,
              )}
              aria-hidden
            >
              <Icon className={cn("size-[13px]", meta?.iconClassName)} strokeWidth={2.1} />
            </div>
            <p className="flex-1 text-sm font-medium leading-6 text-white/80">
              {item.summary}
            </p>
            <BadgeForClass
              changeClass={inferredClass}
              className="self-center px-2.5 py-[0.25rem] text-[0.68rem]"
            />
          </li>
        );
      })}
    </ul>
  );
}
