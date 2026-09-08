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
