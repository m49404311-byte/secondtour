import Link from "next/link";
import { SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="pole" />
      <div className="mx-auto max-w-3xl px-5 py-8 text-sm text-gris">
        <nav aria-label="Informations légales" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/mentions-legales" className="underline underline-offset-4">
            Mentions légales
          </Link>
          <Link href="/cgv" className="underline underline-offset-4">
            Conditions générales de vente
          </Link>
          <Link href="/confidentialite" className="underline underline-offset-4">
            Confidentialité
          </Link>
        </nav>
        <p className="mt-4">
          © {new Date().getFullYear()} {SITE.name}. Fait pour les barbiers et
          coiffeurs indépendants.
        </p>
      </div>
    </footer>
  );
}
