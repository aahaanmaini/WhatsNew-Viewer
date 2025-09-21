import type { Section } from "@/lib/types";
import { BadgeForClass } from "@/components/BadgeForClass";
import { cn, changeIcon, visibleSections } from "@/lib/utils";

type SectionListProps = {
  sections: Section[];
};

export function SectionList({ sections }: SectionListProps) {
  const items = visibleSections(sections);

  if (!items.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      {items.map((section) => (
        <section key={section.title} aria-label={section.title} className="space-y-4">
          <header className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground/90">
              {section.title}
            </h3>
            <div className="h-px flex-1 rounded bg-border/60" aria-hidden />
          </header>
          <ul className="flex flex-col gap-3">
            {section.items.map((item, index) => {
              const Icon = changeIcon(item.class);

              return (
                <li
                  key={`${section.title}-${index}`}
                  className="group flex items-start gap-3 rounded-lg border border-transparent bg-card/30 p-3 transition-colors hover:border-border/60"
                >
                  <div className="mt-1 flex size-7 items-center justify-center rounded-full border border-border/60 bg-muted/20 text-muted-foreground group-hover:border-border">
                    <Icon className="size-4" strokeWidth={2} />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-sm leading-6 text-foreground/90">
                      {item.summary}
                    </p>
                    {item.refs?.length ? (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {item.refs.map((ref, refIndex) => (
                          <span
                            key={`${section.title}-${index}-ref-${refIndex}`}
                            className={cn(
                              "rounded-full border border-border/60 bg-background/40 px-2 py-0.5 font-mono",
                              "text-[0.68rem] tracking-tight",
                            )}
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-1">
                    <BadgeForClass changeClass={item.class} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
