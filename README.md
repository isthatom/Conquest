# EmpireFront

An original browser strategy game project. **Milestone 1: map prototype** is implemented; conquest gameplay is planned. See [architecture and roadmap](docs/PLAN.md) for the game-state design, tradeoffs, milestones and acceptance criteria.

## Setup

Use Node.js 22.12+ (Node 24 recommended) and npm. From the repository root:

```sh
npm ci
npm run dev
```

In this cloud environment, use `npm ci --cache /workspace/.npm-cache` because the default home cache is unavailable.

Vite serves the app on port 5173. No database, credentials or external assets are needed. The renderer uses Canvas 2D and system fonts.

## Controls

Click unclaimed land to found your empire. Drag to pan; scroll or use +/− to zoom; Fit map reframes the world. Inspect terrain by hovering. New expedition resets the original seeded map. Keyboard: focus the map, use arrow keys to select cells, Enter to settle, +/− to zoom. Touch supports one-finger drag and tap; use zoom buttons on touch devices.

## Validation

```sh
npm test
npm run typecheck
npm run build
```

`npm run preview` serves the production build. Tests cover deterministic generation, ownership validation, edge hit testing, adjacency, and cursor-anchored zoom. Browser smoke validation should check rendering, click selection, pan, zoom and reset. Map size/seed/camera limits are configurable in `src/config/map.json`.

## Current limitations

This is an interactive map prototype, not a complete playable match. There is no expansion, AI, economy, military, research, timer or multiplayer yet. Ownership supports empire IDs; the prototype creates only the player empire. Terrain has no combat effect yet. The map uses a procedural grid, rather than geographic assets. No balancing or 15–30 minute match-duration claim is made.
