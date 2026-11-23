# Bienvenue sur Snip — guide de démarrage

Ce guide te permet de démarrer seul. Lis-le une fois en entier, puis garde-le sous la main.

## 1. Le projet en 5 lignes

- **Snip** est une application mobile (PWA) pour les ateliers de couture de Lomé : clients, mesures, commandes, acomptes, soldes, dates de livraison, et un lien de suivi pour le client.
- Nos utilisateurs sont souvent peu à l’aise avec le numérique, sur des téléphones Android d’entrée de gamme et une connexion lente.
- MVP de janvier à mars 2027 (6 sprints de 2 semaines), pilote en avril–mai 2027.
- Je m’occupe des fondations et de tout ce qui est partagé (base de données, sécurité, connexion, design system, abonnements, back-office, import photo, mise en production). Toi, tu construis les écrans métier.
- Les documents de référence sont dans le dossier « Fashion project » : surtout le **Cahier des charges v2** (les identifiants comme ORD-04 ou REC-25 viennent de là) et le document de répartition avec les maquettes.

## 2. Installer le projet

Prérequis : Git, Node.js (version LTS), pnpm, Docker Desktop (pour Supabase en local) et la CLI Supabase.

```bash
git clone https://github.com/D4Ron/Snip.git
cd Snip
pnpm install
cp apps/web/.env.example apps/web/.env.local
supabase start          # lance la base de données en local (Docker doit tourner)
supabase db reset       # crée les tables et les données d’exemple
pnpm dev                # ouvre l’application sur http://localhost:5173
```

Pour tester sur ton téléphone : `pnpm dev --host`, puis ouvre l’adresse affichée depuis un téléphone sur le même Wi-Fi.

Si une commande échoue, envoie-moi le message d’erreur complet plutôt qu’une capture partielle.

## 3. Tes tâches — 22 jours

| Tâche | Sprint | C’est terminé quand… |
|---|---|---|
| **Clients** (CLI-01 à 09) | S2 | On crée, cherche (nom, téléphone, numéro), modifie et archive un client ; les doublons sont signalés sans bloquer ; la fiche montre l’historique et le badge « client fidèle ». REC-01, 03, 11, 20 passent. |
| **Mesures** (MES-01 à 07) | S2 | Le formulaire suit le modèle de la tenue, en cm ; un champ vide n’est jamais zéro ; un nouveau relevé n’écrase pas l’ancien. |
| **Commandes** (ORD-01 à 11) | S3 | Formulaire court d’abord (client, tenue, prix, remise, date, acompte), détails ensuite ; changement d’étape avec journal ; duplication. REC-02, 08, 09, 10 passent. |
| **Écran « Aujourd’hui »** (CAL-01 à 04) | S3 | Livraisons du jour, retards, essayages, commandes prêtes, soldes à encaisser ; vue jour et semaine. |
| **Paiements (interface)** (PAY) | S4 | Ajouter, lister et annuler un paiement ; le solde affiché vient toujours du serveur. REC-04 à 07 et REC-25 passent depuis l’interface. |
| **Documents PDF** (DOC-01, 02) | S4 | Fiche de commande et reçu numéroté, chacun avec un QR code (suivi pour la fiche, vérification pour le reçu). REC-14 et REC-27 passent. |
| **Suivi client** (SUI, NOT) | S5 | Page publique légère (< 200 Ko) sans compte ; boutons « Envoyer sur WhatsApp » (liens wa.me) aux 3 moments clés. REC-21, 22, 23 passent. |

**Au sprint 1**, pendant que je pose les fondations : relis les sections du Cahier qui te concernent, prépare les écrans avec des données factices à partir de la piste de design choisie, et note toutes les questions.

## 4. Les règles à respecter

1. **Tout en français** dans l’interface, avec des mots simples : « Acompte », « Reste à payer », « Prête ». Tous les textes vont dans `src/i18n/fr.ts`.
2. **Utilise les composants du design system** (boutons, champs, cartes, puces de statut). Pas de CSS maison.
3. **Lisible par tous** : texte d’au moins 16 px, boutons d’au moins 48 px, icône toujours accompagnée d’un mot, une seule action principale par écran. Teste chaque écran à 360 px de large.
4. **Ne jamais perdre une saisie** : en cas de coupure réseau, on garde ce qui a été tapé et on affiche un message clair.
5. **Argent** : montants entiers en FCFA, affichés `27 000 FCFA`. Ne calcule jamais un solde dans l’interface : appelle les fonctions du serveur.
6. **Données** : passe toujours par les fonctions et vues `api_v1`, jamais directement par les tables. Si tu as besoin d’une nouvelle colonne ou table, propose-la dans ta PR : j’écris la migration.
7. **Données personnelles** : uniquement des noms inventés dans les tests et les exemples. Aucun mot de passe, clé ou numéro réel dans le code ou les messages de log.
8. **Hors périmètre** : pas de boutique, de paiement en ligne des clients, de stock ni de messages WhatsApp automatiques. Si un pilote le demande, note-le pour plus tard.

## 5. « Terminé » veut dire

- Les critères du tableau ci-dessus sont remplis et les tests REC indiqués passent.
- L’écran a été essayé sur un vrai téléphone Android, à 360 px, avec une connexion lente simulée.
- Les états vide, chargement et erreur existent.
- La PR est relue et fusionnée.

Le dépôt contient aussi un fichier `CLAUDE.md` : si tu utilises Claude pour coder, il y trouvera les règles du projet.
