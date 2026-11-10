// ============================================================
// TOUT CE QUE TU DOIS PERSONNALISER EST ICI.
// Les textes entre [CROCHETS] sont à remplacer avant de vendre.
// ============================================================

export const SITE = {
  name: "Second Tour",
  // La promesse de ta vidéo doit se retrouver ICI, mot pour mot.
  headline: "Tes clients ne sont pas partis. Ils ont juste oublié de revenir.",
  subhead:
    "Second Tour relance tes habitués au bon moment, avec une offre de retour à usage unique. Tu vois combien sont revenus.",
  description:
    "Le rappel automatique qui fait revenir les clients de ton salon ou de ta barbe. 3 questions, c'est gratuit.",
  contactEmail: "[EMAIL DE CONTACT À REMPLIR]",
  deliveryDays: 7, // l'accès ouvre sous 7 jours après paiement (pré-vente)
  guaranteeDays: 30, // satisfait ou remboursé
  refundDelay: "5 jours ouvrés",
  cancelDelay: "2 jours ouvrés",
};

export const LEGAL = {
  owner: "[PRÉNOM NOM]",
  status: "micro-entrepreneur (entrepreneur individuel)",
  siret: "[SIRET À REMPLIR]",
  address: "[ADRESSE À REMPLIR]",
  publisher: "[PRÉNOM NOM]",
  // Franchise en base de TVA : à confirmer avec ton dossier de création.
  vatNote: "TVA non applicable, article 293 B du CGI",
};

export type PlanId = "mensuel" | "annuel";

export type Plan = {
  id: PlanId;
  label: string;
  amount: number; // en centimes
  interval: "month" | "year";
  price: string;
  unit: string;
  perDay: string;
  badge: string;
  note: string;
};

export const PLANS: Record<PlanId, Plan> = {
  mensuel: {
    id: "mensuel",
    label: "Mensuel",
    amount: 2900,
    interval: "month",
    price: "29 €",
    unit: "par mois",
    perDay: "0,95 € par jour",
    badge: "Le plus souple",
    note: "Tu arrêtes quand tu veux.",
  },
  annuel: {
    id: "annuel",
    label: "Annuel",
    amount: 29000,
    interval: "year",
    price: "290 €",
    unit: "par an",
    perDay: "0,79 € par jour",
    badge: "2 mois offerts",
    note: "Soit 24,17 € par mois.",
  },
};

export const PLAN_IDS: PlanId[] = ["mensuel", "annuel"];
