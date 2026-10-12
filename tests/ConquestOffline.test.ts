import { Difficulty } from "@openfront/engine-api/game/GameTypes";
import { EventBus } from "@openfront/shared/EventBus";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ClientEnv } from "../src/client/ClientEnv";
import type { LobbyConfig } from "../src/client/ClientGameRunner";
import { LocalServer } from "../src/client/LocalServer";
import { Transport } from "../src/client/Transport";
import { createMatchConfig } from "../src/client/conquest/MatchConfig";

function lobby(): LobbyConfig {
  return {
    gameID: "gameID12",
    playerName: "Explorer",
    playerClanTag: null,
    playerRole: null,
    turnstileToken: null,
    cosmetics: {},
    gameStartInfo: {
      gameID: "gameID12",
      lobbyCreatedAt: 1000,
      config: createMatchConfig(5, Difficulty.Easy),
      players: [{ clientID: "player12", username: "Explorer", clanTag: null }],
    },
  };
}

describe("Conquest credential-free local sessions", () => {
  beforeEach(() => {
    document.documentElement.dataset.project = "conquest";
    vi.useFakeTimers();
  });
  afterEach(() => {
    delete document.documentElement.dataset.project;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  it("does not refresh account tokens when joining a local match", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const transport = new Transport(lobby(), new EventBus());
    await transport.joinGame();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("resynchronizes the local turn stream without requesting a play token", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const transport = new Transport(lobby(), new EventBus());
    const messages = vi.fn();
    vi.spyOn(ClientEnv, "gitCommit").mockReturnValue("TEST");
    transport.connect(vi.fn(), messages);
    await transport.rejoinGame(0);
    expect(messages).toHaveBeenCalledWith(
      expect.objectContaining({ type: "start" }),
    );
    transport.leaveGame();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("starts and ends a local session without heartbeat or archive requests", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const server = new LocalServer(lobby(), false, new EventBus());
    const onMessage = vi.fn();
    server.updateCallback(vi.fn(), onMessage);
    server.start();
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "start", myClientID: "player12" }),
    );
    server.endGame();
    await Promise.resolve();
    expect(fetch).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
});
