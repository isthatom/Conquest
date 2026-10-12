# EmpireFront (Conquest)

An independent personal strategy-game project based on [OpenFront](https://github.com/openfrontio/OpenFrontIO). **Phase 1: local single-player foundation.** The active launcher uses OpenFront's simulation, renderer, AI, combat and construction. The planned civilian population, taxation, economic buildings and research systems are not implemented yet.

See [phased roadmap](docs/PLAN.md), [upstream provenance](docs/UPSTREAM.md), and the preserved [original prototype plan](docs/archive/ORIGINAL-PROTOTYPE-PLAN.md).

## Local setup

Requires Node **24.15+ within Node 24**, and npm **12.1+ within npm 12**. Use the existing checkout; no extra worktree is needed. Install dependencies without lifecycle scripts:

```sh
npm run inst
npm run dev
```

The development client uses port **9000**. Select your empire name, AI count and difficulty, then start an expedition on a compact Europe, Pangaea or Onion map. Choose a land spawn, expand and build using the inherited controls. Use the End expedition button to return to the menu. Hardware-accelerated WebGL2 is required for normal gameplay. For headless/cloud verification only, append `?software-rendering=1` to the page URL to explicitly allow slow software rendering; this does not validate GPU performance. Test mode selects the small Onion map by default to reduce software-rendering load; you can still choose a different map.

This workflow runs locally in the browser/worker and needs no account, API key, database or game server. It downloads local map assets from the development server.

For this cloud environment, npm 12 is installed under `/workspace/conquest-toolchain`. Activate it and use the writable cache:

```sh
export PATH="/workspace/conquest-toolchain/node_modules/.bin:$PATH"
npm run inst -- --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --strictPort
```

## Checks and production bundle

```sh
npm run test:conquest
npm run typecheck
npm run build
npm run preview
```

`test:conquest` runs derivative configuration/offline tests plus inherited player, attack and WebGL initialization tests with two workers. Only Europe, Pangaea and Onion map assets are retained in this phase. The imported repository contains additional suites; `npm test` is the upstream comprehensive runner, including server tests beyond this phase. `npm run build` emits a standalone client to `static/`; `npm run preview` serves it on port 9000. The upstream `build-prod` and deployment scripts target OpenFront's server/CDN infrastructure and are not the standalone build instructions for this project.

## Attribution and licensing

© OpenFront and Contributors. EmpireFront is independently modified and is not an official OpenFront release or endorsed by OpenFront.

Source code is [AGPL-3.0 with additional attribution/non-misrepresentation terms](LICENSE). Imported open assets in `resources/` are [CC BY-SA 4.0](LICENSE-ASSETS), attributed to OpenFront. Proprietary assets were not imported. The EmpireFront favicon and launcher are original modifications; the favicon is offered under CC BY-SA 4.0. Modified source, build instructions and license notices must remain available when distributing or hosting this derivative. The UI links to this repository as corresponding source: deploy only after the source for the deployed version is pushed there. No original upstream branding font or proprietary music is used.

## Preserved work and limitations

The original standalone map prototype remains in commit `2c77fcedca2852a00b07e6bd0fc06b78c96f1dba` and local branch `prototype-map-archive`; a separate backup was created before migration. This repository retains its existing Conquest history.

The local launcher deliberately does not expose upstream matchmaking, store, login, paid cosmetics or advertising. Server/deployment source remains as reference material, but production multiplayer infrastructure is out of scope. Some inherited game/settings UI may still mention upstream features; this phase does not guarantee those integrations. The default match limit is twenty minutes; balance around a 15–30 minute match requires later testing.
