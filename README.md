# Grande collecte pour la sonorisation
### Église Évangélique des Assemblées du Bénin, Temple Antioche d'Agla Centre

Site de mobilisation pour la campagne de collecte destinée au renouvellement des équipements de sonorisation. Objectif public : **3 500 000 FCFA**. Grande collecte : **dimanche 30 août 2026, à partir de 9h00, Temple Antioche d'Agla Centre**.

Site 100 % statique (HTML, CSS, JS vanilla, aucun framework, aucun backend), pensé pour un hébergement gratuit via Netlify et une découverte principalement sur smartphone via WhatsApp.

---

## Résumé de cette finalisation

### 1. Fichiers modifiés

- `index.html` — Hero entièrement revu (logo, identité, objectif, date, lieu, compte à rebours, deux CTA), équipements devenus des cartes cliquables par catégorie, section "Pourquoi cela compte" renforcée, section Contribuer enrichie (étapes, bouton "J'ai contribué"), section Partage étendue (WhatsApp, Facebook, X, copier le lien), bouton son d'ambiance, ponctuation française revue (plus de tiret utilisé comme séparateur graphique).
- `css/style.css` — Direction artistique éclaircie (fond clair dominant, navy et doré conservés comme couleurs identitaires), animations (révélation au scroll, survols de cartes, zoom du montant, pulsation du compte à rebours, animation du bouton copier), respect de `prefers-reduced-motion`.
- `js/main.js` — Nouvelle nomenclature d'événements analytics, gestion du logo manquant, compte à rebours dans le Hero, modal équipements ouverte par catégorie, partage étendu (Facebook, X, copier le lien), bouton "J'ai contribué", gestion prudente du son d'ambiance (jamais automatique), révélation au scroll.
- `netlify.toml` — Ajout d'en-têtes de sécurité, dont une Content-Security-Policy.

### 2. Fichiers ajoutés

`logo-ad.png` et `partage.png` ont bien été reçus cette fois-ci et sont intégrés au projet, utilisés tels quels (aucune retouche, aucun redessin) :

| Fichier | Emplacement | Statut |
|---|---|---|
| Logo de l'église | `assets/logo-ad.png` | **Intégré** (fichier fourni, utilisé tel quel) |
| Image de partage | `assets/partage.png` | **Intégré** (fichier fourni, utilisé tel quel, 1536x1024px) |
| Son d'ambiance (optionnel) | `assets/audio/ambiance.mp3` | Non fourni, optionnel. En son absence, aucun bouton ne s'affiche, aucune fonctionnalité cassée |

Dès que ces fichiers sont ajoutés au dépôt (aux chemins exacts ci-dessus, sans renommage), le site les utilise automatiquement, sans modification de code.

### 3. Problèmes restants à régler

- Déposer les deux images fournies (`logo-ad.png`, `partage.png`) aux emplacements ci-dessus.
- Renseigner l'URL finale du site dans les balises `og:url` de `index.html` une fois le nom de domaine Netlify connu.
- Si un fichier `assets/audio/ambiance.mp3` est ajouté plus tard, vérifier son poids (privilégier un fichier léger, quelques centaines de Ko maximum, pour ne pas nuire à la performance mobile).
- La Content-Security-Policy ajoutée dans `netlify.toml` (§ Sécurité) autorise volontairement `'unsafe-inline'` pour les styles uniquement (jamais pour les scripts), par prudence, afin de ne rien casser. Elle peut être durcie davantage plus tard si souhaité, après tests.

### 4. Étapes exactes pour tester en local

**Avec Live Server (VS Code) :**
1. Ouvrir le dossier du projet dans VS Code.
2. Clic droit sur `index.html` → "Open with Live Server".
3. Le site s'ouvre sur `http://127.0.0.1:5500` (ou un port similaire) avec rechargement automatique à chaque modification.

**Avec Python (sans installation supplémentaire) :**
```bash
cd campagne-sonorisation
python3 -m http.server 8080
```
Puis ouvrir `http://localhost:8080` dans un navigateur.

**Avec Node.js :**
```bash
npx serve .
```

**Points à vérifier lors du test local** (voir aussi § Qualité finale ci-dessous) : tous les CTA, le compte à rebours, les boutons de copie, le partage WhatsApp/Facebook/X, le lien copié, l'ajout au calendrier, l'ouverture et la fermeture des cartes équipements, l'affichage sur 360px/390px/412px/768px/1024px/1440px, l'absence de débordement horizontal.

---

## Structure du projet

```
campagne-sonorisation/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── README.md          # explique les fichiers à déposer
│   ├── logo-ad.png        # à ajouter
│   ├── partage.png        # à ajouter
│   └── audio/
│       └── ambiance.mp3   # optionnel, à ajouter
├── netlify.toml
├── .gitignore
└── README.md
```

## Technologies utilisées

HTML5 sémantique, CSS3 (variables natives, grid/flexbox, aucun framework), JavaScript vanilla (ES6+, sans dépendance), polices Google Fonts (Fraunces, Work Sans). Aucune bibliothèque tierce lourde.

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| Hero | Logo, identité de l'église, objectif, date, heure, lieu, compte à rebours, deux CTA ("Je contribue", "Voir le rendez-vous") |
| Compte à rebours | Fonctionnel, dynamique, animation légère, s'arrête proprement le jour J sans valeurs négatives |
| Équipements | 5 cartes cliquables par catégorie, ouverture d'un panneau détaillé filtré sur la catégorie, mention "liste indicative et non exhaustive" |
| Copie des numéros | MTN, Moov, Celtiis, confirmation visuelle "Numéro copié" |
| Étapes de contribution | Rappel en 4 étapes avant la liste des numéros |
| "J'ai contribué" | Ouvre WhatsApp avec un message de notification volontaire, présenté explicitement comme tel (aucune vérification automatique de paiement) |
| Partage | WhatsApp, Facebook, X, copier le lien, explication pour Instagram/TikTok |
| Ajout au calendrier | Fichier `.ics` généré dynamiquement |
| Son d'ambiance | Désactivé par défaut, jamais automatique, bouton visible uniquement si un fichier audio valide est présent |
| Animations | Révélation au scroll, survols de cartes, zoom du montant, pulsation du compte à rebours, respect de `prefers-reduced-motion` |
| Barre de progression | Présente dans le code mais masquée tant qu'aucune donnée réelle n'est fournie (aucune donnée fictive) |
| Sécurité | Aucune clé secrète dans le code, en-têtes de sécurité via `netlify.toml`, `textContent` utilisé plutôt que `innerHTML` pour toute donnée dynamique |

## Éléments à vérifier avant mise en ligne

- `assets/logo-ad.png` et `assets/partage.png` sont maintenant intégrés (fichiers fournis, utilisés tels quels).
- Mettre à jour `og:url` dans `index.html` avec l'URL Netlify définitive, une fois connue.
- Relecture finale des textes, montants, date, heure et numéros (repris tels quels, aucune modification apportée).

## Activer la barre de progression plus tard

Dans `js/main.js`, tout en haut du fichier :

```js
const CAMPAIGN_RAISED = null; // à remplacer par { raised: 1250000, goal: 3500000 }
```

Dès qu'une donnée réelle et fiable est disponible, remplacez `null` par l'objet correspondant. La barre s'affiche et se calcule automatiquement.

## Déploiement sans installation (sans VS Code, sans ligne de commande)

Si vous ne pouvez pas installer VS Code ou Git pour le moment, deux méthodes permettent de mettre le site en ligne uniquement depuis un navigateur.

### Méthode rapide — Netlify Drop (site en ligne en 1 minute)

1. Allez sur [app.netlify.com/drop](https://app.netlify.com/drop) (un compte Netlify, gratuit, est recommandé pour pouvoir remettre à jour le site ensuite, mais pas obligatoire pour ce premier dépôt).
2. Glissez-déposez le dossier `campagne-sonorisation` complet (ou le fichier `.zip` fourni, une fois décompressé) directement sur la page.
3. Netlify publie immédiatement le site sur une URL `https://nom-aleatoire.netlify.app`, avec HTTPS automatique.

Limite de cette méthode : le site n'est pas relié à un dépôt GitHub, donc les futures modifications devront être redéposées manuellement de la même façon (glisser-déposer le dossier mis à jour dans Netlify, onglet "Deploys" du site).

### Méthode complète — GitHub (interface web) + Netlify, sans Git en ligne de commande

1. Créez un compte sur [github.com](https://github.com/) si besoin.
2. Cliquez sur "New repository", donnez-lui un nom (par exemple `campagne-sonorisation`), laissez-le public ou privé, puis "Create repository".
3. Sur la page du dépôt vide, cliquez sur "uploading an existing file".
4. Glissez-déposez tous les fichiers et dossiers du projet (`index.html`, `css/`, `js/`, `assets/`, `netlify.toml`, `.gitignore`, `README.md`) puis validez avec "Commit changes".
5. Suivez ensuite l'"Étape 2 — Connecter Netlify" ci-dessous : ce dépôt GitHub fonctionne exactement de la même façon que s'il avait été créé en ligne de commande.

Avec cette méthode, toute modification future se fait de la même manière : ouvrir le fichier sur github.com, cliquer sur le crayon "Edit", modifier, puis "Commit changes". Netlify redéploie automatiquement.

---

## Déploiement en ligne de commande (une fois Git disponible)

### Étape 1 — Créer le dépôt GitHub

```bash
cd campagne-sonorisation
git init
git add .
git commit -m "Site de campagne, version finale"
```

Créez un nouveau dépôt vide sur [github.com/new](https://github.com/new), puis :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/campagne-sonorisation.git
git branch -M main
git push -u origin main
```

### Étape 2 — Connecter Netlify

1. Créez un compte gratuit sur [netlify.com](https://www.netlify.com/).
2. Cliquez sur "Add new site" puis "Import an existing project".
3. Choisissez GitHub et autorisez l'accès au dépôt créé à l'étape 1.
4. Paramètres de build : Build command laissé vide, Publish directory sur `.` (déjà déclaré dans `netlify.toml`, détecté automatiquement).
5. Cliquez sur "Deploy site".

Netlify fournit automatiquement HTTPS/SSL.

### Étape 3 — Déploiement automatique

Chaque `git push` sur la branche `main` déclenche un nouveau déploiement automatique. Aucune manipulation manuelle supplémentaire n'est nécessaire.

### Étape 4 — Nom de domaine (optionnel)

Personnalisable gratuitement dans "Site settings" puis "Domain management".

## Activer Cloudflare Web Analytics (gratuit)

1. Créez un compte gratuit sur [dash.cloudflare.com](https://dash.cloudflare.com/).
2. "Analytics & Logs" puis "Web Analytics".
3. "Add a site" et renseignez l'URL Netlify du site.
4. Cloudflare fournit un token unique.
5. Dans `index.html`, repérez le bloc commenté dans le `<head>`, remplacez `YOUR_CF_BEACON_TOKEN` par le token fourni, puis retirez les balises de commentaire pour activer la ligne.
6. Commit et push.

Le site fonctionne parfaitement avec ou sans cette ligne.

## Événements de suivi disponibles

Tous les événements passent par une fonction unique dans `js/main.js` : `trackEvent("nom_evenement", { paramètres })`. Aucune donnée personnelle n'est collectée (pas d'email, pas de numéro de téléphone, pas de profil individuel).

| Événement | Déclenché quand |
|---|---|
| `page_view` | Chargement de la page (capture les paramètres UTM présents dans l'URL) |
| `hero_je_contribue` | Clic sur un bouton "Je contribue" (header, hero, objectif, collecte, section finale, barre persistante) |
| `hero_rendez_vous` | Clic sur "Voir le rendez-vous" dans le Hero |
| `objectif_je_contribue` | Clic sur "Je contribue" dans la section Objectif |
| `voir_categorie` | Ouverture d'une catégorie d'équipements |
| `copie_mtn` / `copie_moov` / `copie_celtiis` | Copie d'un numéro Mobile Money |
| `jai_contribue` | Clic sur "J'ai contribué" |
| `partage_whatsapp` / `partage_facebook` / `partage_x` | Clic sur un bouton de partage |
| `copie_lien` | Copie du lien de la page |
| `rendez_vous_calendrier` | Clic sur "Ajouter à mon calendrier" |

Par défaut, chaque événement est stocké dans `window.campaignEvents` et transmis à `window.plausible(...)` ou `window.gtag(...)` si l'un de ces objets existe. Pour brancher un fournisseur capable de recevoir des événements personnalisés (Plausible, Umami, GA4), ajoutez son script dans `index.html` : aucune clé secrète ne doit jamais être placée dans un fichier public, toute clé sensible devra passer par une Netlify Function avec variable d'environnement côté serveur.

## Sécurité

- Le site reste entièrement statique, aucune base de données, aucun backend.
- `netlify.toml` ajoute des en-têtes de sécurité, dont une Content-Security-Policy qui limite les scripts au domaine du site et à celui de Cloudflare Web Analytics.
- Aucune clé secrète n'est présente dans `index.html`, `main.js` ou `style.css`.
- Le code utilise systématiquement `textContent` (jamais `innerHTML`) pour toute donnée pouvant varier, afin d'éviter les injections XSS.
- Aucun gestionnaire d'événement inline (`onclick`, etc.) n'est utilisé dans le HTML : toutes les interactions passent par `js/main.js`, chargé en tant que script externe.

## Liens UTM

Le site lit automatiquement `utm_source`, `utm_medium` et `utm_campaign` depuis l'URL et les inclut dans l'événement `page_view`. Exemple :

```
https://votre-site.netlify.app/?utm_source=whatsapp&utm_medium=social&utm_campaign=collecte-aout-2026
```

## QR Code

Une fois l'URL finale connue, elle peut être encodée dans n'importe quel générateur de QR code gratuit, idéalement avec un paramètre UTM dédié.

## Qualité finale (checklist)

- [ ] Tous les boutons répondent correctement (Je contribue, Voir le rendez-vous, catégories, copier, partager, J'ai contribué, calendrier).
- [ ] Le compte à rebours fonctionne et s'arrête proprement le jour J.
- [ ] Les panneaux d'équipements s'ouvrent et se ferment correctement (bouton de fermeture, clic en dehors, touche Échap).
- [ ] Le partage WhatsApp, Facebook, X et la copie du lien fonctionnent.
- [ ] Le logo s'affiche correctement une fois `assets/logo-ad.png` déposé.
- [ ] L'image de partage `assets/partage.png` s'affiche correctement dans un aperçu de lien (WhatsApp, Facebook).
- [ ] Aucune ressource n'est appelée depuis un mauvais chemin (vérifier la console navigateur).
- [ ] Le site fonctionne avec Live Server.
- [ ] Le site fonctionne après déploiement Netlify.
- [ ] Aucun débordement horizontal sur 360px, 390px, 412px, 768px, 1024px, 1440px.

---

*Que Dieu bénisse cette campagne.*
