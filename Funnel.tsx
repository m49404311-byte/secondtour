"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QUESTIONS, estimate, eur, LOST_SHARE, RECOVERED_SHARE } from "@/lib/quiz";
import { PLANS, PLAN_IDS, SITE, type PlanId } from "@/lib/config";

const STEPS = 6; // 3 questions, résultat, avant-goût, paywall
const STORAGE_KEY = "second-tour-reponses";

const FAQ = [
  {
    q: "Est-ce que ça marche pour mon salon ?",
    a: "Oui si tu as des habitués et que tu ne les relances pas aujourd'hui. Si ton logiciel de réservation envoie déjà des rappels, Second Tour ferait doublon : dans ce cas, ne le prends pas.",
  },
  {
    q: "Combien de temps ça me prend ?",
    a: "Quelques secondes par client : tu notes son email au moment de l'encaissement. Le reste est automatique. Au lancement, les rappels partent par email ; le SMS viendra plus tard.",
  },
  {
    q: "Et si je veux arrêter ?",
    a: `Tu écris à ${SITE.contactEmail}, l'abonnement est arrêté sous ${SITE.cancelDelay}. Pas de durée minimale, pas de justification.`,
  },
  {
    q: "À quoi sert exactement ce que je paie ?",
    a: `À un accès à Second Tour : le rappel automatique, l'offre de retour à usage unique et le compteur de clients revenus. Offre de lancement : ton accès ouvre sous ${SITE.deliveryDays} jours. S'il n'est pas ouvert, tu es remboursé.`,
  },
];

export default function Funnel({ cancelled }: { cancelled: boolean }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [plan, setPlan] = useState<PlanId>("mensuel");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(
    cancelled
      ? "Le paiement n'a pas abouti. Aucun prélèvement n'a été fait. Tu peux réessayer ci-dessous."
      : null
  );

  // Retour depuis Stripe après un paiement annulé : on retrouve les réponses.
  useEffect(() => {
    if (!cancelled) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const a = JSON.parse(raw);
      const valid =
        Array.isArray(a) &&
        a.length === 3 &&
        a.every(
          (n: unknown, i: number) =>
            Number.isInteger(n) &&
            (n as number) >= 0 &&
            (n as number) < QUESTIONS[i].options.length
        );
      if (valid) {
        setAnswers(a);
        setStep(5);
      }
    } catch {
      /* sessionStorage indisponible : on repart du début */
    }
  }, [cancelled]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const [a1, a2, a3] = answers;
  const est =
    a1 !== null && a2 !== null && a3 !== null
      ? estimate(QUESTIONS[1].options[a2].value, QUESTIONS[2].options[a3].value)
      : null;

  function choose(q: number, i: number) {
    const next = [...answers];
    next[q] = i;
    setAnswers(next);
    setTimeout(() => setStep(q + 1), 180);
  }

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      } catch {
        /* sans importance */
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, answers }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Erreur");
      }
      window.location.href = data.url;
    } catch {
      setError(
        "Le paiement n'a pas pu démarrer. Aucun prélèvement n'a été fait. Réessaie dans un instant."
      );
      setLoading(false);
    }
  }

  const message = est
    ? `Salut [Prénom] ! Ça fait un moment qu'on ne t'a pas vu chez [Nom du salon]. Pour ton retour, ${est.offer} € de moins sur ta prochaine coupe, valable une seule fois. Dis-moi quand tu passes, je te garde un créneau. À très vite !`
    : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Copie impossible. Sélectionne le texte et copie-le à la main.");
    }
  }

  const selected = PLANS[plan];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-12 pt-4">
      {/* En-tête : retour + progression */}
      <header className="mb-8">
        <div className="flex h-10 items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="-ml-2 min-h-11 px-2 text-sm font-bold underline underline-offset-4"
            >
              Retour
            </button>
          ) : (
            <Link href="/" className="-ml-2 min-h-11 px-2 py-2 text-sm font-bold underline underline-offset-4">
              Accueil
            </Link>
          )}
          <span className="text-sm text-gris">
            Étape {step + 1} sur {STEPS}
          </span>
        </div>
        <div
          className="mt-2 flex gap-1"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS}
          aria-valuenow={step + 1}
          aria-label="Progression"
        >
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 ${i <= step ? "bg-brique" : "bg-sable"}`}
            />
          ))}
        </div>
      </header>

      {/* Questions */}
      {step < 3 && (
        <section>
          <h1 className="font-display text-3xl font-extrabold leading-tight">
            {QUESTIONS[step].title}
          </h1>
          <p className="mt-2 text-gris">{QUESTIONS[step].hint}</p>
          <div className="mt-6 flex flex-col gap-3">
            {QUESTIONS[step].options.map((o, i) => (
              <button
                key={o.label}
                onClick={() => choose(step, i)}
                className={`card min-h-16 px-4 py-3 text-left text-lg font-bold ${
                  answers[step] === i ? "bg-sapin text-papier" : ""
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Résultat personnalisé */}
      {step === 3 && est && a1 !== null && (
        <section>
          <p className="text-sm font-bold uppercase tracking-widest text-brique">
            Ton résultat
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold leading-tight">
            Chaque mois, environ {est.lostVisits} visites s&apos;évaporent chez
            toi.
          </h1>
          <p className="mt-3 text-gris">{QUESTIONS[0].options[a1].echo}</p>

          <div className="card mt-6 p-5">
            <p className="text-sm text-gris">Ce que l&apos;oubli te coûte</p>
            <p className="font-display text-4xl font-extrabold text-brique">
              {eur(est.lostPerMonth)} par mois
            </p>
            <p className="text-gris">soit {eur(est.lostPerYear)} par an.</p>
          </div>

          <div className="card mt-4 bg-sapin p-5 text-papier">
            <p className="text-sm text-sable">Avec Second Tour, tu pourrais récupérer</p>
            <p className="font-display text-4xl font-extrabold">
              +{eur(est.gainPerMonth)} par mois
            </p>
            <p className="text-sable">
              environ {est.recoveredVisits} clients qui reviennent.
            </p>
          </div>

          <p className="mt-4 text-sm text-gris">
            Estimation, pas une promesse : on suppose qu&apos;une visite sur{" "}
            {Math.round(1 / LOST_SHARE)} se perd par oubli et qu&apos;un quart
            est récupéré par un rappel. Tes vrais chiffres peuvent différer.
          </p>

          <button onClick={() => setStep(4)} className="btn mt-8">
            Voir mon message de rappel
          </button>
        </section>
      )}

      {/* Avant-goût */}
      {step === 4 && est && (
        <section>
          <p className="text-sm font-bold uppercase tracking-widest text-brique">
            Ton avant-goût, gratuit
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold leading-tight">
            Ton premier message de rappel, prêt à envoyer.
          </h1>

          <div className="card mt-6 p-5">
            <p className="whitespace-pre-line text-lg">{message}</p>
            <button onClick={copy} className="btn btn-ghost mt-4">
              {copied ? "Copié" : "Copier le message"}
            </button>
          </div>
          <p className="mt-3 text-sm text-gris">
            Utilise-le dès aujourd&apos;hui : envoie-le sur WhatsApp ou par SMS
            aux clients que tu n&apos;as pas revus depuis un mois. Remplace
            [Prénom] et [Nom du salon].
          </p>

          <h2 className="font-display mt-10 text-xl font-bold">
            Ce qui t&apos;attend dans Second Tour
          </h2>
          <ul className="mt-3 flex flex-col gap-3">
            {[
              "Le rappel automatique, envoyé au bon moment après chaque coupe",
              "L'offre de retour à usage unique, avec son code",
              "Le compteur : clients revenus et euros générés",
            ].map((t) => (
              <li
                key={t}
                className="card flex items-center gap-3 p-4 opacity-70"
              >
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="5" y="11" width="14" height="10" rx="1" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                <span className="font-bold">{t}</span>
              </li>
            ))}
          </ul>

          <button onClick={() => setStep(5)} className="btn mt-8">
            Débloquer le reste
          </button>
        </section>
      )}

      {/* Paywall */}
      {step === 5 && est && (
        <section>
          <h1 className="font-display text-3xl font-extrabold leading-tight">
            Voilà ton plan, prêt.
          </h1>
          <p className="mt-2 text-gris">
            Ton message de rappel, ton offre de retour à {est.offer} € et ton
            calcul sont déjà faits. Il reste à tout mettre en route.
          </p>

          {/* Garantie, visible sans défiler */}
          <div className="card mt-5 border-sapin bg-sapin p-4 text-papier">
            <p className="font-bold">
              Satisfait ou remboursé, {SITE.guaranteeDays} jours.
            </p>
            <p className="mt-1 text-sm text-sable">
              Écris à {SITE.contactEmail} : tu es remboursé sous{" "}
              {SITE.refundDelay}, sans justification.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 border-2 border-brique bg-papier p-3 text-sm font-bold text-brique"
            >
              {error}
            </p>
          )}

          <div className="card mt-5 p-5">
            <p className="text-sm text-gris">Ce que ça peut te rapporter</p>
            <p className="font-display text-3xl font-extrabold">
              +{eur(est.gainPerMonth)} par mois
            </p>
            <p className="mt-1 text-gris">
              Pour 29 € par mois, soit environ {est.ratio} fois ce que tu
              paies (estimation à {Math.round(RECOVERED_SHARE * 100)} % de
              retours).
            </p>
          </div>

          <fieldset className="mt-6">
            <legend className="font-display text-xl font-bold">
              Choisis ta formule
            </legend>
            <div className="mt-3 flex flex-col gap-3">
              {PLAN_IDS.map((id) => {
                const p = PLANS[id];
                const on = plan === id;
                return (
                  <label
                    key={id}
                    className={`card relative block min-h-16 cursor-pointer p-4 ${
                      on ? "border-brique shadow-[4px_4px_0_0_var(--color-brique)]" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={id}
                      checked={on}
                      onChange={() => setPlan(id)}
                      className="sr-only"
                    />
                    <span className="absolute -top-3 left-3 bg-brique px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-papier">
                      {p.badge}
                    </span>
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-xl font-bold">
                        {p.label}
                      </span>
                      <span>
                        <span className="font-display text-2xl font-extrabold">
                          {p.price}
                        </span>{" "}
                        <span className="text-sm text-gris">{p.unit}</span>
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-gris">
                      {p.perDay}. {p.note}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button onClick={pay} disabled={loading} className="btn mt-6">
            {loading
              ? "Ouverture du paiement…"
              : `Payer ${selected.price} et garder mon plan`}
          </button>
          <p className="mt-3 text-center text-sm font-bold">
            Sans engagement, résiliable à tout moment.
          </p>
          <p className="mt-1 text-center text-sm text-gris">
            Paiement sécurisé par Stripe. Ton accès ouvre sous{" "}
            {SITE.deliveryDays} jours (offre de lancement), sinon tu es
            remboursé.
          </p>

          <h2 className="font-display mt-12 text-2xl font-bold">
            Les questions qu&apos;on nous pose
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-4">
                <summary className="cursor-pointer list-none font-bold">
                  {f.q}
                </summary>
                <p className="mt-2 text-gris">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
