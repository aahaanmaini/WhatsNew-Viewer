"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ownerSlug = owner.trim();
    const repoSlug = repo.trim();

    if (!ownerSlug || !repoSlug) {
      return;
    }

    const nextPath = `/${encodeURIComponent(ownerSlug)}/${encodeURIComponent(repoSlug)}`;
    router.push(nextPath);
  };

  const isDisabled = !owner.trim() || !repo.trim();

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16 text-foreground">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.35em] text-white/60">
          What&apos;s New
        </span>
        <h1 className="text-5xl font-light tracking-[-0.02em] text-white sm:text-[56px]">
          What&apos;s New?
        </h1>
        <p className="max-w-2xl text-base leading-7 text-white/70">
          Drop in a GitHub repository that publishes <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-xs">whatsnew</code>
          JSON to its <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-xs">gh-pages</code> branch and we&apos;ll show the latest changelog.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 rounded-2xl border border-white/10 bg-[#0c1017] px-6 py-6 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
      >
        <div className="space-y-1.5">
          <label htmlFor="owner" className="text-sm font-medium text-white/75">
            GitHub username
          </label>
          <input
            id="owner"
            name="owner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="e.g. vercel"
            className="w-full rounded-lg border border-white/10 bg-[#10141c] px-3 py-2 text-sm text-white shadow-inner outline-none transition focus:border-white/30 focus:ring-0"
            autoComplete="off"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="repo" className="text-sm font-medium text-white/75">
            Repository name
          </label>
          <input
            id="repo"
            name="repo"
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
            placeholder="e.g. next.js"
            className="w-full rounded-lg border border-white/10 bg-[#10141c] px-3 py-2 text-sm text-white shadow-inner outline-none transition focus:border-white/30 focus:ring-0"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Check What&apos;s New
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
        <span>Need the generator?</span>
        <Link
          href="https://github.com/aahaanmaini/WhatsNew"
          target="_blank"
          className="inline-flex items-center gap-1 font-medium text-white/80 transition-colors hover:text-white"
        >
          <Github className="size-4" aria-hidden="true" />
          WhatsNew on GitHub
        </Link>
      </div>
    </main>
  );
}
