# Phase 1 validation — 12 October 2026

## Current-instance evidence

- Frozen npm dependency installation completed with lifecycle scripts disabled. Node 24.19.0 and a local npm 12.1.0 toolchain were used.
- Full upstream type-check command completed. Root type checking was repeated with incremental caching after the derivative changes; no diagnostics remain.
- Standalone production builds completed. Only Europe, Pangaea and Onion maps are retained; the final static bundle is approximately 69 MB.
- A broader regression run passed 111 tests across 10 files (player/attack, local server, transport, sound, victory UI, derivative configuration/offline checks and WebGL initialization).
- Subsequent targeted checks passed 31 tests across four files after map selection, local rejoin-token and player-panel changes. An earlier fixture failure was corrected by supplying the bootstrap Git commit that the browser provides. Worker startup timeouts under concurrent builds were resolved by running checks sequentially with one test worker.

- The final saved readiness command (`npm run test:conquest`) passed all 59 tests across five files.
- The documented Vite preview command started successfully and served the production HTML.

## Representative browser workflow

A Chromium session exercised the production bundle with all non-local requests blocked. The machine offers software WebGL only, so the explicit `?software-rendering=1` test mode was used on the small Onion map with five AI opponents.

The browser clicked an unclaimed land-cell center through the real map input overlay. Ownership reached 52 tiles. Clicking a visible neutral frontier increased ownership from 52 to 192 tiles. A direct mouse click on End expedition, followed by confirmation, returned to the menu and terminated the session. There were zero browser errors, failed HTTP responses or external requests during this successful run.

The test read the existing control panel's game view to verify worker-delivered ownership changes; it did not inject engine commands or modify the game state. It avoided points obscured by HUD controls and selected tile centers rather than tile edges. Software-rendering compositor delays prevented reliable screenshots and some Playwright stability checks, so direct mouse input was used. This is functional validation, not a hardware-GPU performance measurement.

## Scope limits

The whole upstream test suite, server hosting, account/commerce features, all map assets, full-match balancing and hardware-GPU performance were not validated. Civilian population, taxation and research are not implemented in Phase 1. The default accelerated-WebGL gate remains in place; software rendering requires explicit opt-in. Some inherited game/settings UI still references upstream features, as documented in README.

See docs/PLAN.md for the next phase and docs/UPSTREAM.md for attribution and the imported source revision.
