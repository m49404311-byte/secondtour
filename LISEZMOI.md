# Second Tour — mise en ligne pas à pas

Tu n'as besoin d'installer **rien** sur ton ordinateur. Tout se passe dans le navigateur.

## A. Mettre le projet sur GitHub (10 min)

1. Va sur github.com, crée un compte (gratuit).
2. En haut à droite : **+** puis **New repository**. Nom : `second-tour`. Laisse « Private ». Clique **Create repository**.
3. Sur la page suivante, clique sur le lien **uploading an existing file**.
4. Dézippe le dossier reçu, ouvre-le, et **glisse tout son contenu** (dossiers `src`, fichiers `package.json`, etc.) dans la page GitHub.
5. Attends la fin du chargement, puis clique **Commit changes**.

## B. Mettre le site en ligne avec Vercel (5 min)

1. Va sur vercel.com, clique **Sign Up**, choisis **Continue with GitHub**.
2. Clique **Add New… > Project**, choisis `second-tour`, clique **Import**.
3. Ne change rien, clique **Deploy**. Attends 1 à 2 minutes.
4. Tu obtiens une adresse du type `second-tour-xxxx.vercel.app`. Ouvre-la sur ton téléphone : la landing et le quiz fonctionnent déjà.

## C. Brancher Stripe en mode test (15 min)

1. Va sur stripe.com, crée un compte. Reste en **mode test** (interrupteur « Mode test » en haut à droite, activé).
2. Menu **Développeurs > Clés API**. Copie la **Clé secrète** (elle commence par `sk_test_`).
3. Dans Vercel : ton projet > **Settings > Environment Variables**. Ajoute :
   - `STRIPE_SECRET_KEY` = la clé `sk_test_...`
   - `NEXT_PUBLIC_SITE_URL` = ton adresse Vercel complète, avec `https://` et sans `/` à la fin
4. Dans Stripe : **Développeurs > Webhooks > Ajouter un endpoint**.
   - URL : `https://TON-ADRESSE.vercel.app/api/webhook`
   - Événements : `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`
5. Après création, clique sur **Afficher** à côté de « Clé de signature » (commence par `whsec_`). Copie-la.
6. Dans Vercel, ajoute la variable `STRIPE_WEBHOOK_SECRET` = cette valeur.
7. Dans Vercel : **Deployments**, clique les trois points du dernier déploiement, **Redeploy**.

## D. Paiement de test

1. Ouvre ton site, fais le quiz jusqu'au paywall, clique sur le bouton de paiement.
2. Carte de test : `4242 4242 4242 4242`, date future, CVC `123`, nom et email au choix.
3. Tu arrives sur la page « Merci ». Dans Vercel : **Logs**, cherche `VENTE CONFIRMÉE`. Dans Stripe : le paiement apparaît.
4. Pour tester l'échec : carte `4000 0000 0000 0002`.

## E. Ce que tu dois remplacer avant de vendre pour de vrai

Ouvre `src/lib/config.ts` (sur GitHub : clique le fichier, puis le crayon) et remplace tout ce qui est entre [CROCHETS] : ton email de contact, ton nom, ton SIRET, ton adresse. Chaque modification redéploie le site automatiquement.

Puis, **quand tu as ton SIRET** : Stripe > désactive le mode test > active ton compte (identité, IBAN) > recopie les clés **live** (`sk_live_`, nouveau webhook, nouveau `whsec_`) dans Vercel > Redeploy.

## F. Activer la mesure d'audience

Dans Vercel : ton projet > **Analytics > Enable**. Gratuit, sans cookies.
