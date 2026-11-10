import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Stripe appelle cette adresse après chaque événement de paiement.
// C'est ICI (et pas sur la page /merci) que le paiement est confirmé.
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.payment_status === "paid") {
        // Version 1 : la vente apparaît dans les logs Vercel et dans Stripe.
        // Version 2 : on créera ici le compte (Supabase) et on enverra l'accès.
        console.log("VENTE CONFIRMÉE", {
          session: s.id,
          email: s.customer_details?.email,
          plan: s.metadata?.plan,
          montant: s.amount_total,
        });
      }
      break;
    }
    case "invoice.payment_failed":
    case "customer.subscription.deleted": {
      console.log("ÉVÉNEMENT ABONNEMENT", event.type, event.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
