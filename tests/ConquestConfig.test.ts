import {
  Difficulty,
  GameMapSize,
  GameMapType,
  GameType,
} from "@openfront/engine-api/game/GameTypes";
import { describe, expect, it } from "vitest";
import { createMatchConfig } from "../src/client/conquest/MatchConfig";
import { isEmpireFrontStandalone } from "../src/client/conquest/Project";

describe("EmpireFront local expeditions", () => {
  it("uses a validated local game with finite resources and a twenty-minute cap", () => {
    const config = createMatchConfig(20, Difficulty.Easy);
    expect(config.gameType).toBe(GameType.Singleplayer);
    expect(config.gameMapSize).toBe(GameMapSize.Compact);
    expect(config.bots).toBe(20);
    expect(config.maxTimerValue).toBe(20);
    expect(config.infiniteGold).toBe(false);
    expect(config.infiniteTroops).toBe(false);
    expect(config.nations).toBe("disabled");
  });
  it("accepts a small local map and rejects unknown map IDs", () => {
    expect(
      createMatchConfig(5, Difficulty.Easy, GameMapType.Onion).gameMap,
    ).toBe(GameMapType.Onion);
    expect(() =>
      createMatchConfig(5, Difficulty.Easy, "missing" as GameMapType),
    ).toThrow();
  });
  it("rejects fractional and out-of-range bot counts", () => {
    for (const bots of [-1, 1.5, 401, NaN])
      expect(() => createMatchConfig(bots, Difficulty.Easy)).toThrow();
  });
  it("isolates derivative-only behavior from inherited workflows", () => {
    expect(isEmpireFrontStandalone()).toBe(false);
    document.documentElement.dataset.project = "empirefront";
    expect(isEmpireFrontStandalone()).toBe(true);
    delete document.documentElement.dataset.project;
  });
});
