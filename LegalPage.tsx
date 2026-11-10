import Link from "next/link";
import Footer from "@/components/Footer";

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="mx-auto max-w-2xl px-5 py-10">
        <Link href="/" className="text-sm font-bold underline underline-offset-4">
          Accueil
        </Link>
        <div className="pole mt-4 max-w-[120px]" />
        <h1 className="font-display mt-6 text-4xl font-extrabold leading-tight">
          {title}
        </h1>
        <div className="mt-6 space-y-4 [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
