import Link from "next/link";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-12 text-foreground">
      <span className="rounded-full border border-border/30 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.4rem] text-muted-foreground">
        whatsnew-site
      </span>
      <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--wn-accent)]">
        View changelogs from any public GitHub repo.
      </h1>
      <p className="text-lg text-muted-foreground">
        Point this site at a repository that publishes whatsnew JSON files to its
        <code className="mx-1 rounded bg-card/50 px-2 py-1 text-sm">gh-pages</code>
        branch. Use the URL patterns below to load the latest changelog or a
        specific release.
      </p>
      <div className="w-full rounded-xl border border-border/40 bg-card/20 p-6 text-sm text-muted-foreground">
        <ul className="space-y-3">
          <li>
            <span className="font-mono text-foreground">/{"{owner}"}/{"{repo}"}</span>
            <span className="ml-2 text-muted-foreground">→ latest release</span>
          </li>
          <li>
            <span className="font-mono text-foreground">
              /{"{owner}"}/{"{repo}"}/releases/{"{tag}"}
            </span>
            <span className="ml-2 text-muted-foreground">→ specific release</span>
          </li>
        </ul>
      </div>
      <Button asChild variant="outline" className="mt-2">
        <Link href="https://github.com/whatsnew-dev/whatsnew" target="_blank">
          <Github className="size-4" aria-hidden="true" />
          View the template on GitHub
        </Link>
      </Button>
    </main>
  );
}
