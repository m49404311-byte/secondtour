import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Merci — Second Tour",
  robots: { index: false },
};

export default function Merci() {
  return (
    <>
      <main className="mx-auto max-w-md px-5 py-16">
        <div className="pole mb-8 max-w-[120px]" />
        <h1 className="font-display text-4xl font-extrabold leading-tight">
          Merci, on s&apos;occupe du reste.
        </h1>
        <p className="mt-4 text-lg">
          Si ton paiement est bien passé, tu reçois un reçu de Stripe par email.
        </p>
        <p className="mt-3 text-gris">
          Ton accès à Second Tour ouvre sous {SITE.deliveryDays} jours. On
          t&apos;écrit à l&apos;adresse utilisée pour payer. Une question ?{" "}
          {SITE.contactEmail}.
        </p>
        <p className="mt-3 text-gris">
          Satisfait ou remboursé pendant {SITE.guaranteeDays} jours, sans
          justification.
        </p>
        <Link href="/" className="btn btn-ghost mt-8">
          Retour à l&apos;accueil
        </Link>
      </main>
      <Footer />
    </>
  );
}
