# Personal blog upgrade

## Scope and sequence

1. Preserve the former About page and collect only existing public blog facts.
2. Generate concise About and Work pages from `src/data/profile.json`.
3. Simplify navigation and create a readable responsive editorial layout.
4. Publish static article HTML, canonical routes, a complete writing index, dates, sitemap and RSS. Verify without JavaScript and retain old query links.
5. Complete accessibility and production-build checks; commit and push the foundation.
6. Start `tempest/personal-agent` from that work. Add a small Vercel AI SDK endpoint and streaming interface, with bounded context and cost controls. No RAG, vector database, or external personal-data enrichment.
7. Verify agent behavior, document deployment configuration, commit and push.

See [Personal Agent setup and verification](personal-agent.md) for the optional server endpoint, cost limits, local preview and live-model acceptance checklist.

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

## Implementation audit — September 8, 2026

| Direction | Implementation / evidence |
| --- | --- |
| Homepage hierarchy | Generated profile intro, current work, selected projects, writing and contact; reviewed in browser at desktop and 390px mobile width. |
| Readable About | Concise generated About and separate Work page; original About verified preserved in the archive article. |
| Navigation | About, Work & Research, Writing, Projects, Ask Tempest; technical background moved to secondary links. |
| Research and industry evidence | Selected projects include contributions and links; no invented metrics or individual paper responsibilities. |
| Unified public facts | `profile.json` cites existing blog sources; generated About/Work and Agent use the same facts. No outside enrichment or inferred career availability. |
| Crawlable articles | 44 complete HTML pages, canonical routes, Markdown sources, public directory, sitemap/RSS, legacy redirect handler and real 404s. Static verifier checks content and 458 local links. Deployed-domain crawling remains a deployment check. |
| Writing discovery | Complete generated archive grouped by topic, with selected writing, summaries, dates and reading time. |
| Reading and access | Responsive prose, light/dark mode, mobile menu, skip link and keyboard focus; syntax highlighting and editor lazy-loaded. |
| Personal Agent | Separate branch after foundations; server-only AI SDK, bounded public context, no RAG, streaming UI, safe links, retry/Stop, no chat persistence, disabled fallback. |
| Preservation and release details | Archived biography, compatible old paths, metadata, footer/contact links, deployment docs, frozen dependency lock and quality workflow. |

Local verification: 116 frontend/unit tests and 13 Node/SDK transport tests passed; production build and all-page static verification passed. Browser QA used the production build and a separately labeled mock-model fixture: suggestions, Unicode, follow-up, Stop, Retry, new conversation, Enter submission, mobile width, source-link filtering, and theme changes preserving conversations. SDK tests use the actual installed SDK with a mock provider. Live GLM requests separately verified public research/industry answers and missing-information boundaries; a real upstream rate limit was also verified in the browser, including recovery to a new conversation. See the dated live-test record in `personal-agent.md` for coverage and limitations. Existing development-tool deprecation warnings remain; this work is not a full legacy dependency/security migration.

Deployment handoff: the owner's local key and GLM configuration now serve real responses; no key or billing change is required for the verified local path. No production deployment or main-branch merge has been performed. Before public activation, select the intended Vercel project, configure its server-only environment variables and verify deployed routes and the remaining live-answer cases after provider quota recovers. Chat remains disabled on unconfigured deployments. The implementation and its branch commits are separate from production activation.
