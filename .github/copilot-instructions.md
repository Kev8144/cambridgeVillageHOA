# Copilot Instructions — Cambridge Village HOA

## Project Overview

This is a **Hugo static site** for the Cambridge Village HOA (cambridgevillagehoa.com). It uses the [hugo-arcana](https://github.com/half-duplex/hugo-arcana) theme and is bilingual (English + Spanish).

## Build & Development Commands

```bash
# Serve locally with live reload
hugo server

# Build for production (output goes to /public)
hugo

# Serve including draft content
hugo server -D
```

Hugo version requirement: **≥ 0.86.0** (see `theme.toml`).

## Architecture

### Content & Localization
- All content lives in `content/`. Every page that has a Spanish translation has a paired `.es.md` file (e.g., `faq.md` + `faq.es.md`).
- Language config is split: `config/_default/config.toml` for shared/English settings, `config/_default/config.es.toml` for Spanish overrides.
- Translation strings for UI elements (contact form labels, etc.) are in `i18n/en.toml` and `i18n/es.toml`.

### Homepage Layout
The homepage content is **not** in `content/_index.md` — it is driven by `data/en/homepage.yml` (English) and `data/es/homepage.yml` (Spanish). The YAML defines a list of `items` with types: `highlights`, `heading`, `posts`, `cta`. The `_index.md` files only exist to mark the active menu item.

### Navigation & Menus
Pages appear in the nav by adding `menu: main` and a `weight` to their front matter. There is no separate menus config file.

### Static Assets
- Images go in `static/images/` and are referenced as `/images/filename`.
- Newsletter PDFs and their thumbnail images go in `static/album/` and are referenced as `/album/filename` or `/../../album/filename` (the double `../..` prefix is a pattern used in newsletter links — keep it consistent when adding new newsletter issues).
- Custom CSS overrides go in `assets/sass/custom.scss`.

## Custom Shortcodes (`layouts/shortcodes/`)

| Shortcode | Usage |
|---|---|
| `{{< image src="..." alt="..." width="20%" >}}` | Inline image with clickable link |
| `{{< image type="thumbnail" src="..." alt="..." >}}` | Thumbnail variant (used in newsletters) |
| `{{< icon src="URL" alt="..." width="20px" >}}` | Inline SVG icon (Font Awesome URLs used) |
| `{{< collapsible "Question text" open >}}...{{< /collapsible >}}` | Expandable FAQ section; second param `open` is optional |
| `{{< filloutForm >}}` | Embeds the Fillout.com form (hardcoded form ID `6xjEj5KJTEus`) |

## Theme Setup (No Submodule)

`themes/hugo-arcana` is a **Windows symbolic link** pointing back to the repo root (`..\..\`). This means the repository is both the Hugo site **and** its own theme — there is no external theme submodule to clone.

If you need to recreate this symlink (e.g., after a fresh clone on Windows):

```powershell
cd themes
New-Item -ItemType SymbolicLink -Name "hugo-arcana" -Target "..\.."
```

On Linux/macOS:
```bash
cd themes && ln -s ../.. hugo-arcana
```

> ⚠️ `git clone` does **not** restore the symlink automatically. The `hugo server` command will fail with a "theme not found" error until the symlink is recreated.

## Key Conventions

- **Adding a new post**: Create `content/posts/my-post.md`. Front matter must include `title`, `date` (ISO 8601), and optionally `image` and `tags`. Add a paired `my-post.es.md` for the Spanish translation.
- **Adding a new newsletter issue**: Add the PDF to `static/album/NN_X.pdf` and a thumbnail PNG to `static/album/nn-X-image.png`, then append an entry to `content/newsletters.md` and `content/newsletters.es.md` following the existing pattern.
- **Footer links**: Defined under `[params.footer.links]` in `config/_default/config.toml` (English) and `config/_default/config.es.toml` (Spanish). Contact form is a Formspree endpoint (`mdoqzajr`).
- **Board member page**: Board member photos are stored in `static/images/`. Update `content/meet-the-board.md` and `content/meet-the-board.es.md` when the board changes.
- **`show_post_dates = false`** is set globally — do not add per-post date display logic without changing this param first.

---

## Angular App (`app/`) — In-Progress Migration

A new Angular SPA lives in `app/`. It replicates all Hugo pages and targets DigitalOcean deployment.

### Build & Run

```bash
cd app
npm install
npm start          # dev server → http://localhost:4200
npm run build      # production build → dist/app/browser/
```

### Architecture

- **Routing**: language-prefixed (`/en/...`, `/es/...`). `LangGuard` (`src/app/core/lang-guard.ts`) reads the `:lang` param and calls `translate.use(lang)`.
- **i18n**: `@ngx-translate/core` v18 standalone API — no `TranslateModule`. Import `TranslatePipe` and `TranslateDirective` in each component's `imports` array. Read current lang as `translate.currentLang()` (v18 Signal, not a string). Default language set via `provideTranslateService({ lang: 'en' })` in `app.config.ts`.
- **Content data**: Language-specific JSON in `public/data/{lang}/` — `homepage.json`, `faq.json`, `documents.json`, `newsletters.json`, `board.json`, `posts.json`. Individual post bodies in `public/posts/{lang}/{slug}.json`. All fetched by `ContentService` (`src/app/core/content.ts`).
- **Styling**: Modern SCSS in `src/styles/` — `@use`-based only, zero deprecated Dart Sass syntax. Partials: `_variables.scss` (CSS custom properties + SCSS breakpoint vars), `_reset.scss`, `_typography.scss`, `_layout.scss`, `_header.scss`, `_footer.scss`, `_home.scss`, `_pages.scss`, `_components.scss`. Font Awesome and Source Sans Pro CSS are bundled via the `styles` array in `angular.json`. The old Arcana `libs/` directory is inert — do not import from it.
- **Static assets**: `public/images/`, `public/album/` (mirrors Hugo's `static/`).

### Key Conventions (Angular)

- All page components subscribe to `translate.onLangChange` to reload data when the language switches.
- Post body HTML uses `[innerHTML]` binding (Hugo shortcodes were converted to HTML during migration).
- Every component that builds routerLinks has `get lang() { return this.translate.currentLang() ?? 'en'; }`.
- `nginx.conf` in `app/` is the DigitalOcean server config — it rewrites all routes to `index.html` for SPA routing.
- Adding a new post: add `public/data/en/posts.json` + `public/data/es/posts.json` entries, create `public/posts/en/{slug}.json` and `public/posts/es/{slug}.json` with a `body` HTML string. Copy any images to `public/images/` or `public/album/`.
