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
    <main className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col justify-center gap-10 px-6 py-16 text-foreground">
      <div className="space-y-4">
        <h1 className="text-5xl font-light tracking-[-0.02em] text-white sm:text-[64px]">
          What&apos;s New?
        </h1>
        <p className="max-w-2xl text-base leading-7 text-white/70">
          Drop in a GitHub repository that publishes
          <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-[0.78rem] font-semibold tracking-tight text-white">whatsnew</code>
          JSON to its
          <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5 text-[0.78rem] font-semibold tracking-tight text-white">gh-pages</code>
          branch and we&apos;ll show the latest changelog.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-6 rounded-3xl border border-white/12 bg-[#0b0f14] px-8 py-8 shadow-[0_1px_0_rgba(255,255,255,0.05)]"
      >
        <div className="space-y-2">
          <label htmlFor="owner" className="text-base font-medium text-white/80">
            GitHub username
          </label>
          <input
            id="owner"
            name="owner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="e.g. vercel"
            className="w-full rounded-2xl border border-white/12 bg-[#10141c] px-5 py-3.5 text-base text-white shadow-inner outline-none transition focus:border-white/40 focus:ring-0"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="repo" className="text-base font-medium text-white/80">
            Repository name
          </label>
          <input
            id="repo"
            name="repo"
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
            placeholder="e.g. next.js"
            className="w-full rounded-2xl border border-white/12 bg-[#10141c] px-5 py-3.5 text-base text-white shadow-inner outline-none transition focus:border-white/40 focus:ring-0"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-lg font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
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
