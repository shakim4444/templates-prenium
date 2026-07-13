# Website Templates Pack

Five standalone, animated website templates. Each template is a complete multi-page site with its own design system, shared stylesheet and script.

| Folder | Concept | Niche | Pages |
| --- | --- | --- | --- |
| `architecture/` | MONOLITH | Architecture studio | index, works, studio, contact |
| `gym/` | FORGE | Gym / strength club | index, programs, planning, contact |
| `fashion/` | MAISON | Fashion label | index, collection, atelier, contact |
| `wine/` | DOMAINE | Wine shop / cave | index, vins, domaine, contact |
| `cosmetics/` | LUEUR | Cosmetics brand | index, boutique, science, contact |

## Structure of each template

- `index.html` + 3 inner pages (contact, etc.) — all nav links work
- `style.css` — the full design system (colors are CSS variables at the top)
- `main.js` — animations (GSAP + ScrollTrigger + Lenis via CDN)

If the CDN or internet is unavailable, every page falls back to a static (non-animated) but fully readable and navigable version automatically.

## Run locally

Just open any `index.html` in a browser. No build step, no server needed.

## Deploy on GitHub Pages

1. Create a **public** repo (e.g. `templates`).
2. Upload the five folders (keep the structure).
3. Repo Settings → Pages → Source: *Deploy from a branch* → `main`, `/ (root)` → Save.
4. Your demos go live at:
   - `https://YOUR-USERNAME.github.io/templates/architecture/`
   - `https://YOUR-USERNAME.github.io/templates/gym/`
   - `https://YOUR-USERNAME.github.io/templates/fashion/`
   - `https://YOUR-USERNAME.github.io/templates/wine/`
   - `https://YOUR-USERNAME.github.io/templates/cosmetics/`

## Custom domain

Settings → Pages → Custom domain (e.g. `demo.yourdomain.com`), then add a CNAME record at your DNS provider pointing to `YOUR-USERNAME.github.io`.

## Customizing for a client

1. Change the CSS variables at the top of `style.css` (brand colors).
2. Replace the Unsplash image URLs with the client's photos.
3. Edit texts, prices and contact info directly in the HTML.


## CTA Atelier Web

Chaque page inclut un encart flottant de prise de contact vers Atelier Web :

- WhatsApp : +226 07 42 95 63
- E-mail : team.atelierweb@gmail.com

Le composant est stylé dans `atelier-web-cta.css`, présent dans chaque dossier de template.
