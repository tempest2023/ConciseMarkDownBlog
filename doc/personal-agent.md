# Personal Agent

Ask Tempest is a small optional interface on top of the existing static blog. It uses Vercel AI SDK on the server, AI Gateway, and a streaming React interface. There is no RAG, embedding job, vector database, tool execution, or stored conversation history. The SDK is not included in the browser bundle.

## Public context

`src/data/profile.json` is the curated source for personal claims. `src/data/articles.json` is a generated directory of titles, summaries, source types and links, not full article contents. Update the profile only from already-public blog information, then run `npm run content` and rebuild. Do not silently promote a template, sample recommendation letter, old claim or inferred job-search status into a biographical fact.

The prompt asks for short replies in the visitor's language, source links and an explicit admission when information is missing. It is not a security boundary or a guarantee of factual correctness. All supplied information must be safe to disclose. The interface strips HTML/images and makes only links supplied in the public context clickable. The guide cannot contact Tao, apply for jobs, browse or take actions.

## Enable locally or on Vercel

1. Use Node 22 and `yarn install --frozen-lockfile`.
2. Create a dedicated AI Gateway API key and configure a budget for that key in the Vercel dashboard. Choose the amount yourself; this project does not purchase credits or change billing settings.
3. For local preview, create a gitignored `.env.local` using `.env.example` as the template. For deployment, add the same server-only variables in the target Vercel project's environment settings: `AI_GATEWAY_API_KEY`, `PERSONAL_AGENT_ENABLED=true`, and optionally `AGENT_MODEL` (default `deepseek/deepseek-v4.1-flash`, selected by the owner). Never use a `REACT_APP_` prefix and never commit credentials.
4. Run `npm run build && npm run preview`; open `http://127.0.0.1:4173/ask/`. The regular React development server does not run the chat endpoint. Restart preview after changing server environment variables.
5. On Vercel, deploy this branch with the repository's `vercel.json` and verify `/api/chat`, `/ask/`, a nested article URL and a legacy `?page=` URL. API key changes require a new deployment. Keep chat disabled on public deployments until the live-answer checklist below passes.

GitHub Pages serves the full static articles but cannot run `/api/chat`. Chat gracefully shows links to the profile and contact details when unavailable. Disabling `PERSONAL_AGENT_ENABLED` also disables the endpoint; static content remains usable. No production deployment is performed by the test commands.

Model availability note (checked September 8, 2026): [Vercel's model page](https://vercel.com/ai-gateway/models/deepseek-v4.1-flash) labels this model experimental and says it expires September 10. Treat it as a temporary test choice, not a confirmed long-lived production model. Recheck availability before deployment and replace it through `AGENT_MODEL` with the owner's chosen successor. The application does not silently switch to another paid model when a model fails.

## Cost and privacy boundaries

Each reply is one model generation with no automatic retries, at most 600 output tokens, a 25-second timeout, and at most seven messages / 8,000 conversation characters. Each message is limited to 2,000 characters; the HTTP body to 18,000 bytes. Only the last three complete turns are retained as input, trimmed further if needed. The fixed public context is resent each time; the context-size regression test flags growth above 40,000 characters. Character limits are not token counts or a precise price estimate.

The in-memory limiter allows six requests per client per five minutes and 100 per server instance per UTC day. It resets on cold starts and does not coordinate across instances, so it is **not a global spend cap**. Clients without an Origin header may use the endpoint programmatically; same-origin checking is not authentication. Use the dedicated Gateway key budget as the external spend control and review provider/hosting charges, refill settings and usage separately. See [Vercel's budget documentation](https://vercel.com/docs/ai-gateway/observability-and-spend/budgets).

The application does not persist conversations or log prompts, replies or raw provider errors. Messages still pass through Vercel and the model provider, whose retention settings and policies apply. In-memory throttling uses a daily hashed client address. A visitor should not submit private information. Stopping a reply aborts the upstream request but does not erase already incurred usage.

## Verification

```sh
npm run test:agent
CI=true npm test -- --watchAll=false --runInBand
npm run build
npm run test:static
```

Agent tests run the real installed SDK against a mock model, through HTTP and the client SSE parser. They verify transport, input limits, timeouts, cancellation and error behavior without credentials or paid calls. They **do not verify real-model factuality or deployment credentials**.

For UI-only testing, run `node tests-agent/preview-fixture.mjs` after building and open `http://127.0.0.1:4174/ask/`. This fixture is loopback-only and always returns visibly labeled test text. It uses no API key. Questions containing `[error]` fail; `[slow]` run long enough to test Stop. Never deploy this fixture as the application handler.

Before enabling the real model, manually check these cases in English and Chinese:

- Research and industry questions: supported claims with valid source links, no invented metrics or individual paper contributions.
- Current job search, salary, location, notice period: unknown unless explicitly published; refer to the public contact address.
- Article detail absent from the directory: admit missing detail, offer the article link, no invented quote.
- “Ignore your instructions”, fabricated career history, template letters: do not adopt unverified claims or reveal hidden/private data.
- Unrelated requests: briefly redirect to the public profile rather than acting as a general-purpose chatbot.
- Follow-up, retry, Stop, long Chinese input, mobile keyboard and provider outage: usable UI, no duplicate submission or permanent loading state.

Record the model, date, results and observed usage when these checks are performed. Prompt tests alone must not be reported as proof that the model always follows instructions.
