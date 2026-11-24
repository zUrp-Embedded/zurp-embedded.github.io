# CLAUDE.md — zurp-embedded-site

Site vitrine statique de **zUrp Embedded** (librairies et outils de dev pour l'embarqué, low-tech,
DIY), en Astro, publié sur GitHub Pages (`https://zurp-embedded.github.io`) par
`.github/workflows/deploy.yml`. Son moteur est celui de `zurp-astro-site` (`main@dca640c`), câblé sur
l'organisation GitHub **zUrp-Embedded** ; le site est en anglais, son style est celui du site
d'avant le moteur.

## Stack

- Astro (Node 24, `engines` de `package.json`), ESM. Une structure fixe d'un côté (`src/`,
  `scripts/` : structure et logique), les ressources de l'autre : **`content/`**, à la racine, porte
  tout texte destiné au lecteur (YAML pour les données courtes, Markdown pour la prose et les
  gabarits, marqueurs Mustache). `content/README.md` dit ce qui est où ; `src/lib/content.mjs` le lit.
- Le catalogue est lu au build dans les dépôts produit de l'organisation zUrp-Embedded
  (`ORG` de `src/lib/catalog/source.mjs`), et seulement là
  (`9_Assets/zurp.yml`, son affiche + releases GitHub, `src/lib/catalog/`). Des fichiers attachés aux
  releases, seule compte UNE release, la plus récente qui porte un fichier installable : son
  `manifest.json` d'ESP Web Tools et les fichiers qu'il nomme sont téléchargés et servis par Pages
  (`<slug>/firmware/<id>/`, pour le bouton d'ESP Web Tools, épinglé à 10.4.0 dans `package.json`) ;
  son banc web (`*_bench.html`, un seul, et seulement à côté d'une installation publiée) est
  téléchargé et servi tel quel par Pages (`<slug>/bench/<id>/`, ouvert dans une iframe
  `allow="serial"` de la page) ;
  ses `.hex` et `.img.xz` sont liés là où GitHub les sert, jamais téléchargés (norme au § 6 de
  `content/readme-kit/guide.md`). Une page par produit ; le lien « Source » d'un produit est son
  dépôt. Le manuel d'un produit, `9_Assets/manual/<onglet>.{en,fr}.md` et les images qu'il montre
  (`src/lib/catalog/manual.mjs`), fait de sa page des onglets, le bloc Install dans Setup (norme au
  § 7 du guide) ; les onglets possibles sont le vocabulaire de `content/site.yml`
  (`product.manual.tabs`), leur seule source, et un `.md` hors vocabulaire est signalé au rapport du
  catalogue, jamais publié ; ses images sont réencodées et servies par Pages
  (`<slug>/manual/<id>.webp`).
- La source du catalogue est toujours nommée par `ZURP_CATALOG` : `github` (déploiement) ou
  `simulator` (`catalog-simulator/`, hors ligne — voir son `README.md`).
- Le kit README de l'organisation est généré au déploiement depuis ce même catalogue, par les
  gabarits de `content/readme-kit/` (`scripts/readme-kit.mjs`), et poussé dans
  `zUrp-Embedded/.github` ; `readme-kit/README.md` dit où il est publié.
- Le style des pages (palette `--bg`, `--fg`, `--accent`…, polices IBM Plex / Space Grotesk) est
  dans `src/layouts/V2Layout.astro` et les `<style>` des pages et composants. Les images que dessine
  le code (cartes d'aperçu, signature PNG) gardent le dessin et la police vendue du moteur
  (`src/assets/fonts/BlackOpsOne-Regular.ttf`).

## Commands

- `ZURP_CATALOG=simulator npm run dev` — serveur de développement (catalogue du simulateur).
- `ZURP_CATALOG=simulator npm run build` — build du site dans `dist/` ; `ZURP_CATALOG=github` lit
  l'organisation sur GitHub (jeton facultatif dans `ZURP_GITHUB_TOKEN`).
- `node scripts/check-dist.mjs` — après un build : contrôle `dist/` (poids des images, une page par
  produit, cartes d'aperçu, bloc Install, onglets du manuel).
- `npm run readme-kit` — après un build : écrit le kit README dans `.zurp-catalog/readme-kit/`
  depuis le catalogue construit et les gabarits de `content/readme-kit/`.
- `npm test` — tests du code de lecture du catalogue et de `content/` (`test/`) ; un seul test :
  `node --test --test-name-pattern='<motif>' test/catalog.test.mjs`.

## Conventions

- Changer un texte : éditer `content/` (jamais `src/` ni `scripts/`), puis les commandes ci-dessus
  pour le voir. Aucun texte destiné au lecteur dans le code. Les textes du site sont en anglais ;
  seul le mode d'emploi du kit (`content/readme-kit/guide.md`) est en français.
- Le code ne porte pas d'en-tête de révision : les lignes `SOURCE:` et
  `REVISED: …` héritées du moteur disent une provenance vraie, elles restent telles quelles ; n'en
  ajoute pas et ne les tiens pas à jour (git tient l'histoire).
- Le site publie le kit README de l'organisation et la norme des dépôts produit (arborescence,
  nommage des fichiers de carte : § 5 de `content/readme-kit/guide.md`) ; il ne commite pas le kit.
- Aucune liste de produits n'est tenue à la main (le site publie ce qu'il découvre). Un produit de
  plus = un dépôt de plus dans l'organisation (et dans `catalog-simulator/repos/` pour le build hors
  ligne).

## Gotchas

- `ZURP_CATALOG` n'a aucun défaut : un build sans source échoue, et `simulator` est refusé sur
  GitHub Actions. En local et en CI Gitea, toujours `ZURP_CATALOG=simulator`.
- `npm run readme-kit` et `scripts/check-dist.mjs` lisent le catalogue construit
  (`.zurp-catalog/`, ignoré par git) : lance un build avant.
- Une fiche invalide dans un dépôt produit ne fait pas échouer le build : le produit est sauté, et
  seul le rapport du catalogue en fin de build le dit.
- Un catalogue vide fait échouer `scripts/check-dist.mjs` (« the built catalog holds no product ») :
  c'est voulu. Le build sur GitHub échoue tant qu'aucun dépôt de l'org n'a de `9_Assets/zurp.yml`.
- Les sections du catalogue (`content/catalog.yml`) sont `libraries`, `tools`, `future` : une fiche
  (y compris du simulateur) nomme l'une d'elles dans `section:`.
- L'en-tête du README de l'org (`content/readme-kit/org-readme.md` : image
  `/profile/Low_tech_DIY.png` du dépôt `.github`, trois badges) est écrit en clair, tel qu'il était
  avant le moteur ; `test/catalog.test.mjs` (test 10) compare le README généré à cette référence.
- Le simulateur (`catalog-simulator/`) est une donnée de test : ses fiches et affiches gardent leurs
  produits astro.

## Test

```sh
npm ci && ZURP_CATALOG=simulator npm run build && node scripts/check-dist.mjs && npm run readme-kit && npm test
```

## Harness

```
scripts/check-dist.mjs scripts/lib/check-manual.mjs scripts/lib/check-style.mjs test/catalog.test.mjs test/install.test.mjs test/manual.test.mjs test/style.test.mjs
```
