export type Option = { label: string; value: number; echo?: string };
export type Question = { title: string; hint: string; options: Option[] };

export const QUESTIONS: Question[] = [
  {
    title: "Comment tes clients te réservent-ils ?",
    hint: "Sois honnête, ça change le calcul.",
    options: [
      {
        label: "Sans rendez-vous, ils passent à l'arrivée",
        value: 0,
        echo: "Tu prends tes clients à l'arrivée : personne ne te prévient quand un habitué disparaît.",
      },
      {
        label: "Par Instagram, WhatsApp ou téléphone",
        value: 1,
        echo: "Tu prends tes clients par message : une conversation qui s'arrête, et le client est oublié.",
      },
      {
        label: "Avec un logiciel de réservation (Planity, etc.)",
        value: 2,
        echo: "Ton logiciel envoie peut-être déjà des rappels. Vérifie : si oui, Second Tour ferait doublon.",
      },
    ],
  },
  {
    title: "Combien de clients passent chez toi par semaine ?",
    hint: "Une moyenne suffit.",
    options: [
      { label: "Moins de 30", value: 20 },
      { label: "30 à 60", value: 45 },
      { label: "60 à 100", value: 80 },
      { label: "Plus de 100", value: 120 },
    ],
  },
  {
    title: "Combien coûte une coupe chez toi, en moyenne ?",
    hint: "Le prix que tu encaisses vraiment.",
    options: [
      { label: "Moins de 20 €", value: 18 },
      { label: "20 à 30 €", value: 25 },
      { label: "30 à 40 €", value: 35 },
      { label: "Plus de 40 €", value: 45 },
    ],
  },
];

// Hypothèses affichées à l'écran (ce sont des estimations, pas des promesses) :
// - 1 visite sur 5 se perd simplement par oubli
// - un quart de ces visites est récupéré par un rappel
export const LOST_SHARE = 0.2;
export const RECOVERED_SHARE = 0.25;

export function estimate(weekly: number, price: number) {
  const monthlyVisits = Math.round(weekly * 4.3);
  const lostVisits = Math.round(monthlyVisits * LOST_SHARE);
  const lostPerMonth = lostVisits * price;
  const lostPerYear = lostPerMonth * 12;
  const recoveredVisits = Math.max(1, Math.round(lostVisits * RECOVERED_SHARE));
  const gainPerMonth = recoveredVisits * price;
  const ratio = Math.round((gainPerMonth / 29) * 10) / 10;
  const offer = Math.max(1, Math.round(price * 0.1));
  return {
    lostVisits,
    lostPerMonth,
    lostPerYear,
    recoveredVisits,
    gainPerMonth,
    ratio,
    offer,
  };
}

export function eur(n: number) {
  return n.toLocaleString("fr-FR") + " €";
}
