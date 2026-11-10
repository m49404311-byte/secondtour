import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <main className="mx-auto max-w-md px-5 py-24">
        <div className="pole mb-8 max-w-[120px]" />
        <h1 className="font-display text-4xl font-extrabold leading-tight">
          Cette page n&apos;existe pas.
        </h1>
        <p className="mt-4 text-gris">
          Le lien est peut-être ancien, ou mal copié. Rien de grave.
        </p>
        <Link href="/" className="btn mt-8">
          Retour à l&apos;accueil
        </Link>
      </main>
      <Footer />
    </>
  );
}
