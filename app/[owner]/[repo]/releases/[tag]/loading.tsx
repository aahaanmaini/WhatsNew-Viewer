import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingRelease() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12 text-muted-foreground">
      <header className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-3/4" />
      </header>

      <section className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </section>

      <p className="text-sm text-muted-foreground">
        Fetching the release changelog…
      </p>
    </main>
  );
}
