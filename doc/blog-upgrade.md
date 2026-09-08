# Personal blog upgrade

## Scope and sequence

1. Preserve the former About page and collect only existing public blog facts.
2. Generate concise About and Work pages from `src/data/profile.json`.
3. Simplify navigation and create a readable responsive editorial layout.
4. Publish static article HTML, canonical routes, a complete writing index, dates, sitemap and RSS. Verify without JavaScript and retain old query links.
5. Complete accessibility and production-build checks; commit and push the foundation.
6. Start `tempest/personal-agent` from that work. Add a small Vercel AI SDK endpoint and streaming interface, with bounded context and cost controls. No RAG, vector database, or external personal-data enrichment.
7. Verify agent behavior, document deployment configuration, commit and push.

## Content ownership

Edit `src/data/profile.json` to update public profile facts. `npm run content` generates About and Work; the original biography is preserved verbatim after the archive introduction in `Blogs/AI/My_AI_Research_and_Engineering_Journey.md`.

Profile facts cite source page identifiers. The complete public article catalog is generated from Markdown; its entries describe documents, not necessarily facts about Tao. Historical recommendations, templates, and examples must never be treated as evidence of personal achievements. No additional private information or speculative job-search state is included.

The source-review date describes when the source was read, not when employment was externally verified. Current career availability is unspecified. Never invent performance metrics or publication status.

## Design context

Audience: researchers, engineers, collaborators and prospective employers. Visitors should be able to quickly understand Tao's work, read technical writing, and later ask grounded questions.

Direction: research-oriented, readable, contemporary, restrained. Strong typography and selected work provide identity; the agent supplements full static content. Keep the blog light and Markdown-driven, retain light/dark themes, and make mobile and keyboard reading first-class.

## Static publication

`npm run build` generates profile pages, a complete writing index, a public article catalog, sitemap and RSS, then compiles React and renders each Markdown article with the same GFM, math and HTML-link policy used in the browser. The built HTML contains the complete article before JavaScript loads. React receives the original Markdown in a safely escaped JSON bootstrap, avoiding a second content request on direct visits.

Canonical routes live in `src/util/routes.js`. Add Markdown under `src/articles/Blogs/` and rebuild; it appears in Writing, RSS and the sitemap automatically. `build/content/` exposes the original Markdown and `build/articles.json` is a machine-readable content map. This is static publication, not retrieval or RAG.

Vercel rewrites only legacy root query links to `api/legacy.js`, which returns an HTTP redirect to a catalog-approved path. It does not use the former catch-all SPA rewrite: unknown URLs return a real 404. The editor and local configuration have their own noindex pages. Search crawling is allowed, including OAI-SearchBot; no new GPTBot training restriction is introduced. `llms.txt` is intentionally optional and unnecessary for reading the article HTML.

Run `npm run preview` (port 4173) to test the static output with legacy redirects and real 404 responses; `npm run test:static` checks every page, source, local link, metadata, index entry and legacy redirect. GitHub Pages can serve the clean static URLs, but cannot run the legacy redirect endpoint or the later chat endpoint. On that host old query URLs still resolve in React when JavaScript is enabled. Vercel is the intended complete deployment target. Root hosting is assumed; a project-subpath deployment needs its base paths configured.

Dates are derived from the first and latest source Git commits, and are approximate publication dates for historical imports. Profile pages use the profile source's change date. The archive's September 8 note identifies the archival event separately. Keep full Git history in CI when preserving historical dates.
