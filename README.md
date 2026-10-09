# Fluent Path — English B1 → B2

Minimal, mobile-first study app: read chapters, do exercises, take notes, track completion.

## Current architecture (as is)

- React 18 + Vite 5 + TypeScript + Tailwind + shadcn-ui. Client-only, no backend.
- Routes: `/` (home), `/chapters`, `/chapter/:id`, `/progress`.
- Content: 5 seed chapters in `src/data/initialChapters.ts` (sample content, not Notion).
- State: `src/hooks/useChapters.ts`, built on pure functions in `src/lib/chapterStorage.ts`.
- Persistence: browser `localStorage`, key `english-course-chapters` (JSON array of chapters incl. status and notes).

### Data safety
- Stored JSON is structurally validated on load.
- If invalid, the app does not crash: the raw value is copied to `english-course-chapters.corrupt-<timestamp>`, the original key is left untouched until the next edit, and the seed content is shown with a warning on the Progress page.
- **Export**: Progress page → "Export my data (JSON)" downloads chapters plus the raw stored value.

## Limits
- Data lives in one browser only; clearing site data loses it (export first).
- No accounts, no sync, no Notion integration, no Supabase. No import of the export file yet.
- Editing a chapter after a corruption overwrites the main key (the backup key remains).

## Commands
```sh
npm i
npm run dev      # dev server
npm run lint     # ESLint
npm test         # Vitest (src/**/*.test.ts)
npm run build    # production build
```

## Future migration strategy (not implemented)
1. Users export their JSON backup.
2. Content source: replace `initialChapters` with a read from Notion (via a server-side function — Notion tokens must never ship to the browser).
3. User data (status, notes): move to a database (e.g. Supabase/Lovable Cloud) keyed by user + chapter id; import the exported JSON once.
4. Keep `chapterStorage.ts` pure functions as the domain layer; only the load/save adapters change.

## Import / sécurité des données (Sprint L0-B)

- Page Progress → « Import data (JSON) » : accepte uniquement un fichier produit par l'export (`app: "fluent-path"`, `version: 1`, chapitres valides, ids uniques). Aperçu du nombre de chapitres et confirmation explicite obligatoires.
- Avant remplacement, la valeur actuelle est copiée sous `english-course-chapters.pre-import-<timestamp>`. Si cette copie échoue, rien n'est remplacé.
- Si les données stockées sont corrompues, les modifications restent en mémoire et la clé d'origine n'est jamais écrasée ; seule une importation confirmée la remplace.
- CI : `.github/workflows/ci.yml` (npm ci, lint, typecheck, tests, build) — s'exécute seulement si le dépôt est poussé sur GitHub.
