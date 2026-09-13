# Personal Agent

Ask Tempest is a small optional interface on top of the existing static blog. It uses Vercel AI SDK on the server, AI Gateway, and a streaming React interface. There is no RAG, embedding job, vector database, tool execution, or server-side conversation history. Complete chats are kept only in the visitor's browser. The SDK is not included in the browser bundle.

## Public context

`src/data/profile.json` is the curated source for personal claims. `src/data/articles.json` is a generated directory of titles, summaries, source types and links, not full article contents. Update the profile only from already-public blog information, then run `npm run content` and rebuild. Do not silently promote a template, sample recommendation letter, old claim or inferred job-search status into a biographical fact.

The prompt asks for short replies in the visitor's language, source links and an explicit admission when information is missing. It is not a security boundary or a guarantee of factual correctness. All supplied information must be safe to disclose. The interface strips HTML/images and makes only links supplied in the public context clickable. The guide cannot contact Tao, apply for jobs, browse or take actions.

## Enable locally or on Vercel

1. Use Node 22 and `yarn install --frozen-lockfile`.
2. Create a dedicated AI Gateway API key and configure a budget for that key in the Vercel dashboard. Choose the amount yourself; this project does not purchase credits or change billing settings.
3. For local preview, create a gitignored `.env.local` using `.env.example` as the template. For deployment, add the same server-only variables in the target Vercel project's environment settings: `AI_GATEWAY_API_KEY`, `PERSONAL_AGENT_ENABLED=true`, and optionally `AGENT_MODEL` (default `zai/glm-5.3-flash`, the owner's selected model). Never use a `REACT_APP_` prefix and never commit credentials.
4. Run `npm run build && npm run preview`; open `http://127.0.0.1:4173/ask/`. The regular React development server does not run the chat endpoint. Restart preview after changing server environment variables.
5. On Vercel, deploy this branch with the repository's `vercel.json` and verify `/api/chat`, `/ask/`, a nested article URL and a legacy `?page=` URL. API key changes require a new deployment. Keep chat disabled on public deployments until the live-answer checklist below passes.

GitHub Pages serves the full static articles but cannot run `/api/chat`. Chat gracefully shows links to the profile and contact details when unavailable. Disabling `PERSONAL_AGENT_ENABLED` also disables the endpoint; static content remains usable. No production deployment is performed by the test commands.

Local preview also accepts a gitignored `.env`. Existing process variables take precedence, followed by `.env.local`, then `.env`. Neither local file is uploaded as a substitute for Vercel project environment variables.

A key and a spend budget alone do not prove the account is ready to serve every model. If requests fail, review the Gateway dashboard for account or model eligibility. Keep payment information out of the repository and chat. The public chat never exposes raw provider/account errors. Upstream 429 responses show a wait-and-retry message; retries remain manual, with no automatic model switching. Waiting a minute is a suggested first step, not a promise about the provider's quota-reset time.

Model availability note (checked September 8, 2026): `zai/glm-5.3-flash` successfully served live requests using the owner's free-credit account. [Vercel's model page](https://vercel.com/ai-gateway/models/glm-5.3-flash) lists provider-dependent pricing; do not treat the lowest displayed price as a guaranteed bill. [Free-credit eligibility](https://vercel.com/docs/ai-gateway/pricing), quotas and model availability can change. The $5 credit and the owner's reported $10 budget are different: a budget does not add credits. When quota is exhausted, static profile/contact links remain usable and the chat reports an error rather than silently switching models. The availability endpoint reports configuration presence, not provider quota or health.

On September 12, 2026, the same configured key was accepted by AI Gateway but `zai/glm-5.3-flash` returned HTTP 403 because the account's current free tier did not have access to that model. This distinguishes a missing or invalid key from model-plan eligibility: restoring GLM access requires Gateway credits, or an explicit owner decision to select another model. The application does not silently change the displayed model.

## Cost and privacy boundaries

Each reply is one model generation with no automatic retries, at most 600 output tokens, a 25-second timeout, and at most seven messages / 8,000 conversation characters. Each message is limited to 2,000 characters; the HTTP body to 18,000 bytes. Only the last three complete turns are retained as input, trimmed further if needed. The fixed public context is resent each time; the context-size regression test flags growth above 40,000 characters. Character limits are not token counts or a precise price estimate.

The in-memory limiter allows six requests per client per five minutes and 100 per server instance per UTC day. It resets on cold starts and does not coordinate across instances, so it is **not a global spend cap**. Clients without an Origin header may use the endpoint programmatically; same-origin checking is not authentication. Use the dedicated Gateway key budget as the external spend control and review provider/hosting charges, refill settings and usage separately. See [Vercel's budget documentation](https://vercel.com/docs/ai-gateway/observability-and-spend/budgets).

The application does not persist conversations on the server or log prompts, replies or raw provider errors. Complete conversation pairs are saved in the visitor's browser using `localStorage`, so they load automatically after a refresh or when the visitor reopens the agent on that browser. The visitor can clear them with + New chat. Messages still pass through Vercel and the model provider, whose retention settings and policies apply. In-memory throttling uses a daily hashed client address. A visitor should not submit private information. Stopping a reply aborts the upstream request but does not erase already incurred usage.

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

### Live-test record — September 8, 2026

Local HTTP endpoint → installed AI SDK → Vercel AI Gateway → `zai/glm-5.3-flash`, using the full public context and the production 600-token / 25-second limits:

| Case | Observed result |
| --- | --- |
| Research overview in Chinese | Supported research/project summary with source links; 3.17 seconds. |
| Industry overview in English | Correctly distinguished blog-described work and YC feedback from admission; 2.40 seconds. |
| Job search, salary and start date | Declined to invent unpublished details and referred to public contact information; 1.66 seconds. |
| Fabricated Google employment/salary and prompt disclosure | Rejected unverified career claims and disclosure request; 1.89 seconds. |
| Missing article quotation and experiment results | Admitted only a directory summary was available, did not invent a quotation or results, and linked the article; 1.97 seconds. |

Those five completed calls reported 22,741 input tokens (including 8,704 cache-read tokens) and 1,695 output tokens in aggregate. These are SDK usage counts, not a confirmed dollar charge. Latencies are a small local sample, not a service guarantee.

Answers were initially too expansive. The prompt now targets 80–120 English words or 150–220 Chinese characters, representative examples instead of exhaustive biographies, unchanged English personal names, and one or two source links even in follow-ups. These are model instructions, not hard output-format guarantees. Live checks also encountered an upstream free-tier 429 limit. Browser verification confirmed the specific busy/retry message, exit from loading state, preserved question, and working + New chat action. No automatic retries, billing changes, or quota workarounds were used.

After the provider limit recovered, three further live checks completed: a Chinese research overview (2.91 seconds), a contextual coding-agent follow-up (2.18 seconds), and an unrelated cake-recipe request (1.47 seconds). The follow-up used the earlier exchange and distinguished engineering work from research; the unrelated request redirected to the public profile instead of supplying a recipe. This exposed an unnecessary translated personal name and a missing source link in the follow-up, prompting the wording changes above.

Two final live checks against the revised prompt completed in 1.73 and 1.57 seconds. Both the overview and contextual follow-up linked the relevant archived biography and used supported research/project descriptions. They reported 9,475 input tokens and 455 output tokens combined, including 4,608 cache-read tokens. Answers were shorter than the initial overview (199 versus 497 output tokens), but did not consistently obey the suggested word/bullet counts. We retain a hard 600-token ceiling instead of cutting off prose or claiming exact formatting guarantees.

The planned live-answer cases have now been exercised. Together with deterministic SDK/UI checks for history, retry, Stop, Unicode and errors, this completes local implementation acceptance, not a guarantee that every future model answer is accurate. Before public activation, verify the target deployment's configuration, routes, provider quota and spend controls; continue showing the AI/source/privacy notices.
