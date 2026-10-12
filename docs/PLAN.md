# Conquest phased development plan

Conquest now builds on OpenFront rather than the original independent Canvas prototype. Preserve upstream attribution and document each modification. Keep engine package names stable to make upstream changes easier to review; the user-facing project name is Conquest. The archive plan records the original design, not the current implementation.

## Phase 1 — Playable, attributed foundation (current)

Import a pinned upstream source snapshot, excluding proprietary assets. Add an original local single-player launcher for a compact Europe map, configurable AI count and difficulty. Reuse upstream simulation, AI, combat, construction and renderer. Remove upstream advertising/account/commerce bootstrap from the active entry point; prevent local match uploads and account-dependent rewards. Retain AGPL notices and provide corresponding-source and asset-license links. Preserve the original map prototype in Git history and an archive branch.

Acceptance: dependency installation without lifecycle scripts, relevant simulation tests, complete type check, standalone production build, and browser verification of launching a local game, choosing a spawn and expanding against AI. Reload/return-to-menu must terminate the local session. No calls to official OpenFront gameplay, account or monetization services are required. Do not claim new civilian/economy systems in this phase.

## Phase 2 — Civilian population and taxation

Add an opt-in Conquest rule set to the deterministic engine, not a browser-only resource counter. Separate civilians from existing troops. Capacity depends on controlled territory; tax rate trades income against growth. Use fixed-tick arithmetic and configuration constants. Extend start-config validation, worker updates and replay/snapshot serialization together. Show civilians, capacity, growth, treasury/income and a tax slider. AI uses the same economic commands. Keep the inherited gold/troop system working when the rule set is off; avoid double-counting inherited passive income and troop regeneration when it is on.

Acceptance: deterministic growth/income tests, tax bounds and command validation, equivalent replay results, no treasury/population underflow, and a browser demonstration of the tax/growth tradeoff. Choose rates through playtests; a twenty-minute timer alone does not establish balanced pacing.

## Phase 3 — Development and military tradeoffs

Add housing, farms, markets and barracks through the existing construction/command workflow. Recruitment costs civilians and gold; upkeep makes army size an economic choice. Reuse defense-post mechanics for the initial fort rather than creating a second combat system. Configurable construction durations and clear costs precede animation polish.

Acceptance: capacity, growth and income modifiers apply once; insufficient-resource commands reject cleanly; recruitment/upkeep are deterministic; AI pays the same costs; the player can develop, recruit and conquer in one complete match.

## Phase 4 — Research and match balance

Add academy research and small agriculture, engineering, military and economy upgrade tracks. Default research takes roughly one to three minutes, subject to investment and balancing. Implement the intended 15–30 minute progression and transparent timeout scoring; use existing victory checks where compatible. Introduce AI priorities incrementally, then run repeated playtests.

Acceptance: upgrade prerequisites/costs, exactly-once effects, serializable research progress, clear victory/defeat results and measured match-duration distributions. Document known balance problems instead of hiding them.

## Phase 5 — Portfolio polish

Improve feedback, responsive controls, performance measurements and documentation. Add original sound only after asset provenance is clear. Record a demo and provide repeatable local setup. Defer custom multiplayer hosting, authentication, store, paid assets, diplomacy expansions and complex supply chains.

## Verification policy

For each phase run meaningful engine tests, type checking, production build and browser smoke checks. Extend tests around behavior that can regress. Keep external integration tests separate from the credential-free local workflow. Imported upstream bugs should be reported with their baseline status; do not disable assertions to obtain a green run.
