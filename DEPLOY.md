# Desplegament a GitHub Pages — LaVermellaFCB al Mundial

L'aplicació és una SPA estàtica de React/Vite amb enrutament per `#hash`, una PWA
instal·lable. Es publica servint la carpeta de build `dist/public/`.

## 1. Generar el build estàtic

```bash
npm install
npm run build
```

Els fitxers estàtics queden a `dist/public/` (HTML, JS, CSS, `manifest.webmanifest`,
`sw.js` i les icones). Tots els camins són **relatius** (`vite.config.ts` té
`base: "./"`), de manera que funciona sota un subcamí com `/<repo-name>/`.

## 2. Publicar a GitHub Pages

Tria una de les dues opcions.

### Opció A — Branca `gh-pages` (manual, ràpida)

```bash
# Des de l'arrel del repo, després de "npm run build":
git switch --orphan gh-pages
git --work-tree dist/public add --all
git --work-tree dist/public commit -m "Deploy PWA"
git push origin gh-pages --force
git switch -   # tornar a la branca anterior
```

A GitHub: **Settings → Pages → Build and deployment**
- **Source:** `Deploy from a branch`
- **Branch:** `gh-pages` / `/ (root)`

La URL serà: `https://<usuari>.github.io/<repo-name>/`

### Opció B — GitHub Actions (recomanat, automàtic a cada push)

El workflow ja és al repositori: **`.github/workflows/deploy.yml`**. Fa
`npm ci` → `npm run build` i publica `dist/public/` amb les accions oficials de
GitHub Pages (`configure-pages`, `upload-pages-artifact`, `deploy-pages`).

L'única configuració necessària al repositori:

**Settings → Pages → Source: `GitHub Actions`**

A partir d'aquí, cada push a `main` (o una execució manual des de la pestanya
**Actions → Deploy PWA to GitHub Pages → Run workflow**) reconstrueix i publica
automàticament. La URL serà `https://<usuari>.github.io/<repo-name>/`.

## 3. Notes sobre el subcamí

Gràcies a `base: "./"` i a l'enrutament per `#hash`, **no cal** configurar cap
`base` addicional ni un fitxer `404.html`. Si en el futur es canvia a enrutament
per History API, caldrà afegir un `404.html` que redirigeixi a `index.html`.

## 4. Instal·lar al mòbil (Afegir a la pantalla d'inici)

El service worker i el manifest només s'activen sota **HTTPS** (com a GitHub Pages),
mai a les previsualitzacions en sandbox.

- **Android (Chrome):** obre la URL → menú ⋮ → **Instal·lar aplicació** /
  **Afegir a la pantalla d'inici**.
- **iOS (Safari):** obre la URL → botó **Compartir** → **Afegir a la pantalla
  d'inici**.

L'app s'obrirà en mode `standalone` (pantalla completa, sense barra del navegador),
en orientació vertical, amb el color de tema navy `#0d1b30`.
