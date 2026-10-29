# Dependency security review — 2026-10-28

Base: `main` at `dc09c96`. Source: all pages of the repository's GitHub Dependabot alerts API and a fresh Yarn/npm registry audit.

## Result

- GitHub had 147 open alerts: 3 critical, 78 high, 50 medium, and 16 low. The eight historical fixed alerts require no further changes.
- All 146 non-withdrawn open alerts no longer match any installed version in the updated `yarn.lock`. Each package was checked against all affected-version ranges in its GitHub advisory, including multiple installed major versions.
- Alert #170 is withdrawn upstream; see the exception below.
- The additional registry audit found Zod and KaTeX advisories missing from the original GitHub list. Both are fixed here as well.
- Final `yarn audit --json` reports zero critical, high, or moderate findings. It reports one low-severity advisory (`deepmerge`) through three dependency paths; that reviewed exception remains visible in audit output.
- CodeQL default setup is not configured and the code-scanning API has no analysis. Secret scanning is disabled. Those results do not establish that source or secrets have been scanned.
- GitHub alert status will be reevaluated after this PR is merged into the default branch. This review did not dismiss alerts.

## Changes

Refresh dependencies within their existing version ranges. Upgrade SVGR, resolve-url-loader, CSS minimization, Workbox, webpack-dev-server, Jest and jsdom where the previous major versions retain vulnerable dependencies. The new development-server certificate chain removes `node-forge` entirely, including its advisory without a patched release.

Migrate the development server to its current HTTPS, middleware and shutdown APIs. Keep host validation enabled without a backend proxy, remove wildcard CORS headers, and preserve the trailing slash on the middleware public path. Mount the native Host and cross-origin checks before source-map handlers and `src/setupProxy.js` routes. Preserve the Express app passed to proxy setup, and refuse startup if either native check is missing. HTTP/HTTPS regression tests exercise invalid Host and cross-site request rejection on custom routes, normal route responses, and source-map endpoint protection.

Update Jest's asset transforms to return `{ code }`, as required by Jest 29. Browser coverage exercises math rendering and syntax highlighting after the dependency updates.

The following resolutions address dependencies whose parents still request older releases:

| Resolution | Reason and compatibility |
| --- | --- |
| `compression ^1.8.2` | `serve` pins an affected release; retain the same major API. |
| `prismjs ^1.30.0` | Refractor pins 1.27.0; use the patched 1.x renderer. |
| `underscore ^1.13.8` | JSONPath pins 1.13.6; use the patched 1.x implementation. |
| `uuid ^11.1.1` | SockJS is the sole consumer and calls the CommonJS `v4()` API, which is retained in 11.x. |
| `katex 0.18.10` | Fix the trust-restriction advisory in older math plugins; pin the release before 0.18.11, which upstream deprecated for accidental breaking changes. Verify both static and browser rendering. |

Zod is updated to 4.6.7 for [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). KaTeX also addresses [GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7).

## Reviewed exceptions

### Withdrawn braces advisory

[Alert #170](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/170), [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), was withdrawn on October 23, 2026 because upstream determined it was not practically exploitable. No patch is available or required for this withdrawn advisory.

### deepmerge: low severity, no upstream patch

[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) affects deepmerge 4.3.1, already present in the base lockfile. There is no patched upstream version. The fresh audit reports three paths to this one advisory:

- `@svgr/webpack > @svgr/plugin-svgo > deepmerge`: plugin-svgo declares the dependency but its distributed implementation does not import or invoke it. This repository also sets `svgo: false`.
- `jest > @jest/core > jest-config > deepmerge`.
- `jest > jest-cli > @jest/core > jest-config > deepmerge`.

Jest uses deepmerge to combine preset globals with configured globals. This repository supplies neither a Jest preset nor globals, and these settings are repository-controlled rather than blog visitor input. No application/server import of deepmerge was found. On this evidence, no reachable attack path was identified in the current configuration, so this review retains the dependency and documents it instead of introducing a custom fork or an older vulnerable release. Reassess when a patch is published or when adding presets, globals, SVG optimization, or untrusted build configuration. `yarn audit` still exits nonzero (2) for this finding; no ignore rule was added.

## Original open-alert coverage

“Removed” means the dependency is absent from the new lockfile. Every version listed was compared with every applicable affected range for that package. Braces is the withdrawn exception above; all other rows are remediated.

| Package | Open alert numbers | Versions in new lockfile |
| --- | --- | --- |
| `@babel/core` | [#114](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/114) | `7.29.7` |
| `@babel/helpers` | [#23](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/23) | `7.29.10` |
| `@babel/plugin-transform-modules-systemjs` | [#96](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/96) | `7.29.8` |
| `@babel/runtime` | [#24](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/24) | `7.29.10` |
| `@tootallnate/once` | [#99](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/99) | `2.0.1` |
| `ajv` | [#59](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/59), [#60](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/60) | `8.18.0`, `6.15.0`, `8.20.0` |
| `body-parser` | [#11](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/11), [#125](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/125), [#175](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/175) | `1.20.9` |
| `brace-expansion` | [#29](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/29), [#30](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/30), [#86](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/86), [#89](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/89), [#120](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/120), [#124](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/124), [#134](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/134), [#135](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/135), [#136](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/136), [#138](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/138), [#162](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/162), [#163](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/163), [#164](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/164), [#165](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/165), [#166](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/166), [#167](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/167) | `1.1.21`, `2.1.7`, `5.0.12` |
| `braces` | [#170](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/170) | `3.0.3` |
| `browserslist` | [#152](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/152), [#153](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/153) | `4.29.5` |
| `colord` | [#154](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/154) | Removed |
| `compression` | [#169](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/169) | `1.8.2` |
| `cookie` | [#16](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/16) | `0.7.2` |
| `cross-spawn` | [#18](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/18) | `7.0.6` |
| `diff` | [#45](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/45) | `5.2.2` |
| `express` | [#12](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/12) | `4.22.3` |
| `fast-uri` | [#128](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/128), [#130](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/130), [#137](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/137), [#144](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/144), [#145](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/145), [#149](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/149), [#150](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/150), [#159](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/159), [#161](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/161), [#176](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/176), [#177](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/177), [#178](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/178) | `3.1.9` |
| `flatted` | [#75](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/75), [#76](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/76) | `3.4.4` |
| `follow-redirects` | [#92](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/92) | `1.16.2` |
| `form-data` | [#32](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/32), [#106](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/106) | `4.0.6` |
| `glob` | [#38](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/38) | `11.1.0`, `7.2.3` |
| `http-proxy-middleware` | [#17](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/17), [#25](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/25), [#26](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/26), [#115](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/115) | `2.0.11` |
| `js-yaml` | [#34](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/34), [#35](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/35), [#116](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/116), [#117](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/117), [#121](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/121), [#122](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/122), [#140](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/140), [#141](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/141), [#157](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/157), [#158](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/158) | `3.15.2`, `4.3.2` |
| `jsonpath` | [#50](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/50), [#57](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/57) | `1.3.0` |
| `katex` | [#21](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/21) | `0.18.10` |
| `launch-editor` | [#104](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/104), [#108](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/108), [#172](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/172), [#173](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/173), [#174](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/174) | `2.14.2` |
| `lodash` | [#46](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/46), [#90](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/90), [#91](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/91) | `4.18.1` |
| `micromatch` | [#8](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/8) | `4.0.8` |
| `minimatch` | [#61](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/61), [#62](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/62), [#63](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/63), [#65](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/65), [#66](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/66), [#67](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/67), [#68](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/68), [#69](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/69), [#70](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/70) | `3.1.5`, `10.2.6`, `5.1.9` |
| `nanoid` | [#20](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/20), [#143](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/143), [#146](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/146), [#147](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/147) | `3.3.20` |
| `node-forge` | [#40](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/40), [#41](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/41), [#42](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/42), [#81](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/81), [#82](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/82), [#83](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/83), [#84](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/84), [#168](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/168) | Removed |
| `nth-check` | [#2](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/2) | `2.1.1` |
| `path-to-regexp` | [#10](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/10), [#19](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/19), [#87](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/87) | `3.3.0`, `0.1.13` |
| `picomatch` | [#78](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/78), [#79](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/79) | `2.3.2`, `4.0.7` |
| `postcss` | [#6](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/6), [#102](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/102), [#132](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/132), [#133](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/133), [#139](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/139) | `8.5.32` |
| `postcss-selector-parser` | [#148](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/148) | `6.1.5`, `7.1.7` |
| `prismjs` | [#22](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/22) | `1.30.0` |
| `qs` | [#43](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/43), [#55](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/55), [#151](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/151) | `6.16.2` |
| `rollup` | [#15](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/15), [#64](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/64) | `4.66.0` |
| `send` | [#14](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/14) | `0.19.2` |
| `serialize-javascript` | [#71](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/71), [#101](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/101) | `7.1.4` |
| `serve-static` | [#13](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/13) | `1.16.3` |
| `shell-quote` | [#105](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/105), [#123](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/123) | `1.12.0` |
| `svgo` | [#74](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/74), [#129](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/129), [#155](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/155), [#156](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/156) | `3.3.5`, `4.1.0` |
| `underscore` | [#72](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/72) | `1.13.8` |
| `uuid` | [#100](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/100) | `11.1.1` |
| `webpack` | [#9](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/9), [#51](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/51), [#52](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/52) | `5.112.2` |
| `webpack-dev-middleware` | [#160](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/160) | `7.4.6` |
| `webpack-dev-server` | [#27](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/27), [#28](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/28), [#97](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/97), [#109](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/109), [#126](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/126), [#127](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/127) | `5.2.7` |
| `websocket-driver` | [#118](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/118), [#119](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/119) | `0.7.5` |
| `ws` | [#103](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/103), [#112](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/112), [#113](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/113) | `8.22.0` |
| `yaml` | [#77](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/77), [#80](https://github.com/tempest2023/ConciseMarkDownBlog/security/dependabot/80) | `1.10.3` |

## Validation

- Frozen-lockfile installation succeeds.
- ESLint succeeds.
- Jest: 11 suites, 131 tests pass.
- Agent tests: 20 pass.
- Tooling regression tests: 6 pass, including real HTTP/HTTPS servers and SockJS UUID compatibility. These run in the quality workflow.
- Production build and static rendering succeed: 45 pages, 981 local links.
- Playwright: all 79 tests pass using installed Google Chrome via a temporary local configuration. The default bundled Chromium was missing after the Playwright update; its download was stopped in favor of the installed browser. Repository browser configuration is unchanged.
- The real `scripts/start.js` process compiles and serves the app, then exits successfully on SIGTERM.
- The final registry audit reports only the documented deepmerge exception; the original GitHub advisory-range comparison has zero unresolved non-withdrawn alerts.

These are local results. CI, deployment and default-branch alert closure are separate checks on the PR.
