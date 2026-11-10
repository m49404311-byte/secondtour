"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-md px-5 py-24">
      <div className="pole mb-8 max-w-[120px]" />
      <h1 className="font-display text-4xl font-extrabold leading-tight">
        Un souci de notre côté.
      </h1>
      <p className="mt-4 text-gris">
        Ce n&apos;est pas ta faute. Réessaie, ou reviens à l&apos;accueil.
      </p>
      <button onClick={reset} className="btn mt-8">
        Réessayer
      </button>
      <Link href="/" className="btn btn-ghost mt-4">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
