# Production deployment

The complete blog (static article HTML and same-origin `/api/chat`) runs in the
`agi-studio/concise-markdown-blog` Vercel project. GitHub integration tracks
`tempest2023/ConciseMarkDownBlog`, production branch `main`.

## Deploy

Push to `main` for automatic deployment, or run `npm run deploy` with an
authenticated Vercel CLI after linking this directory to the project.
Use Node 22 and `yarn install --frozen-lockfile`. Vercel runs `npm run build`,
including static publishing in `postbuild`, and serves `build/` plus `api/`.
Keep `framework: null`: the CRA preset adds a SPA fallback that shadows legacy
query redirects and returns the homepage with HTTP 200 for unknown paths.
GitHub Pages is unpublished, and its deployment workflow has been retired.

Production environment variables are configured in Vercel:

- `PERSONAL_AGENT_ENABLED=true`
- `AI_GATEWAY_API_KEY` (sensitive, server-only)
- `AGENT_MODEL` (ordered primary and fallback model identifiers)

Never prefix these variables with `REACT_APP_`. `.vercelignore` excludes local
secret files. Environment changes require a new deployment.

## Anonymous chat limits

No login or CAPTCHA is required. A published Vercel Firewall rule named
`Blog chat per-IP limit` matches POST `/api/chat`: 6 requests per IP per
300-second fixed window, returning rate-limit responses on excess requests.
This rule is project configuration, not part of `vercel.json`; recreate it if
moving to a different project. It avoids adding a database solely for IP counts.

The handler additionally limits input size, history, output to 600 tokens,
and model execution to 25 seconds. Its in-memory daily limit of 100 requests
is **per instance**, resets on restart, and is not a global spending cap.
The firewall IP rule also does not impose a global budget or stop rotating IPs.
Disable chat with `PERSONAL_AGENT_ENABLED=false` and redeploy if needed.

## Custom domain

`tempest.fun` is attached to this Vercel project. Authoritative DNS remains at
Aliyun; the apex `@` A record points to Vercel. Use the current value shown in
Vercel's Domains settings if this record needs to be changed. The `www`
subdomain needs its own Vercel domain and CNAME record if it should be served.
Canonical links use `https://tempest.fun`.

## Verification

Run `CI=true npm test -- --watchAll=false --runInBand`, `npm run test:agent`,
`npm run build`, and `npm run test:static`.
After deployment verify `/`, `/writing/`, a nested article, `/?page=Blog`
(308 redirect), an unknown path (404), GET `/api/chat`, a streaming POST,
and the firewall's 429 response on the custom domain.

Routing uses an explicit route order: headers, legacy root query handler,
filesystem, then the custom 404. A normal rewrite is insufficient because the
existing root index.html takes filesystem precedence.
