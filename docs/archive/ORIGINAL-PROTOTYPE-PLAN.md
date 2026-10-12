# Conquest architecture and roadmap

## Concept and challenges
Fast conquest should create pressure to invest without requiring city micromanagement. One treasury, civilians, soldiers and research progress are enough initially. Taxation should trade immediate income against growth; recruitment should trade civilian productivity against military power. Target a 20-minute default match, with a configurable 30-minute hard limit. Balance requires measured playtests, not a claim that an initial formula delivers the target duration.

Primary technical challenges are rendering many territories while zooming, identifying adjacent land efficiently, explaining deterministic combat, and keeping economic growth from snowballing. Browser frame rates must not change simulation outcomes. AI must obey the same command validation as humans. A future server must be able to validate commands without a browser.

## Practical architecture
Use TypeScript, Vite, Canvas 2D, HTML/CSS, Vitest, and JSON configuration. No external gameplay services or credentials are needed.

- `engine`: serializable state, seeded map generation, adjacency, validated commands and pure simulation updates. No DOM, Canvas or wall-clock dependency.
- `config`: terrain definitions, map dimensions and later economy/combat constants in JSON.
- `render`: camera transforms, terrain, ownership, borders, selection and later combat overlays. Rendering reads state and never advances it.
- UI: translates user intentions into commands and displays command results. Camera and hovered cell are local presentation state.
- Runtime: a fixed 100ms simulation step, bounded catch-up and an independent animation frame render loop. Milestone 1 has no time-dependent simulation; add this loop with expansion in Milestone 2.
- Later multiplayer: authoritative Node simulation accepting sequenced commands with tick numbers; snapshots and state hashes support reconciliation. Do not implement networking now.

## Core data structures
Milestone 1: `GameState { seed, width, height, cells, empires, phase, selectedStart }`; `Cell { id, x, y, terrain, ownerId }`; `Empire { id, name, color }`. IDs are stable row-major indices. Phase is `choosing` or `started`.

Later: `EmpireEconomy { civilians, army, treasury, taxRate, researchPoints }`; `Building { id, kind, cellId, completionTick }`; `Attack { id, attackerId, sourceId, targetId, committedArmy, remainingArmy }`; `Research { technologyId, progress, startedTick }`; `Command { playerId, sequence, tick, kind, payload }`; `Match { tick, status, winnerId, scoreBreakdown }`. Keep resources numeric, ownership referenced by ID, and completed technologies as IDs. Store arrays and records, not browser objects. Derive capacity, growth and defense from territory, buildings and upgrades rather than storing redundant totals. Document rounding rules before combat implementation.

## Territory and borders
Start with a seeded rectangular grid and four-way land adjacency. Each land cell is one territory; water cannot be claimed. This keeps hit testing O(1), command validation simple, and territorial expansion easy to test. Terrain increases from water to plains, forest and mountains. Draw borders only where neighboring owners differ, or land meets water. Use compact integer ownership IDs and a frontier set if map scale later demands it.

Milestone 2 expands one adjacent cell per simulation interval. Milestone 4 adds progressive attack resolution across frontiers with visible commitment. Avoid free-form polygons and per-pixel flood fill at this stage. Terrain is visual in Milestone 1; movement and defense modifiers arrive with combat. Ensure starting locations have sufficient contiguous land and fair distances before complete matches.

## Smallest genuinely playable MVP
Milestone 1 is an interaction prototype, not a playable conquest game. The smallest playable loop is reached after Milestone 4: choose a start, expand, tax and build housing/markets, recruit, and fight one rule-based AI with a simple territory victory threshold. Research and five AI personalities are unnecessary for proving that loop. Milestone 6 completes the originally specified match structure.

## Roadmap and acceptance criteria

1. **Map prototype:** initialize the project, seeded terrain and ownership, pan/zoom and select a start. Accept when the same seed produces the same map, water cannot be selected, exactly one player-owned starting territory is created, zoom stays anchored to the cursor, panning works, reset allows another selection, and tests/type check/build pass. No expansion, economy, combat or AI yet.
2. **Expansion:** introduce fixed timestep, validated adjacency commands, frontier overlays and one AI using the same command rules. Accept when neutral expansion is progressive, non-adjacent/water claims fail, equivalent command/tick sequences give identical state, and frame rate does not change expansion speed.
3. **Economy:** configurable civilian growth/capacity, taxation, treasury, housing, farms and markets. Accept when high tax reduces growth, treasury integrates income and upkeep correctly, costs reject insufficient funds, capacity limits growth, and UI rates match engine calculations.
4. **Military / playable MVP:** recruitment, committed attacks, terrain defense, barracks, forts and military AI. Accept when recruiting consumes civilians and treasury, committed soldiers cannot be reused, equal inputs produce equal combat results, defeat transfers ownership, and a player can win or lose a full small-map match.
5. **Technology:** academies and agriculture/engineering/military/economy upgrades. Accept when prerequisites/costs are enforced, research takes configured 1–3 minute baseline durations, upgrades apply once, and UI communicates progress and benefits.
6. **Complete match:** multiple empires with expansionist/militarist/economist/technologist/opportunist policies, elimination, majority-control win, timeout scoring and results. Accept when AI uses the same economy/commands, eliminated empires stop acting, victory triggers once, score components are transparent, and repeated playtests measure a 15–30 minute match distribution.
7. **Polish:** responsiveness, feedback, performance and settings; optional original sound. Accept when common desktop/mobile sizes work, camera interactions remain smooth on the target large map, controls are accessible, and performance measurements document a frame budget.

At every milestone run meaningful engine tests, type checking, production build and a browser smoke test. Keep source changes scoped to the current milestone and record limitations in README.

## Postpone
Multiplayer, WebSockets, diplomacy, trade networks, unit micromanagement, naval warfare, roads, production chains, complex technology prerequisites, save persistence, sound, PixiJS migration and adaptive AI are deferred. Also postpone ornamental statistics and real-world map assets. Use original procedural terrain and simple shapes. Build reproducible replay tests before adding nondeterministic behavior.
