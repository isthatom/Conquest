import {
  GameConfigSchema,
  type GameConfig,
} from "@openfront/engine-api/Schemas";
import {
  Difficulty,
  GameMapSize,
  GameMapType,
  GameMode,
  GameType,
} from "@openfront/engine-api/game/GameTypes";

export function createMatchConfig(
  bots: number,
  difficulty: Difficulty,
  map: GameMapType = GameMapType.Europe,
): GameConfig {
  return GameConfigSchema.parse({
    gameMap: map,
    gameMapSize: GameMapSize.Compact,
    gameType: GameType.Singleplayer,
    gameMode: GameMode.FFA,
    difficulty,
    bots,
    nations: "disabled",
    donateGold: false,
    donateTroops: false,
    infiniteGold: false,
    infiniteTroops: false,
    instantBuild: false,
    randomSpawn: false,
    disabledUnits: [],
    maxTimerValue: 20,
  });
}
