import { Difficulty, GameMapType } from "@openfront/engine-api/game/GameTypes";
import { EventBus } from "@openfront/shared/EventBus";
import { generateID } from "@openfront/shared/SharedUtil";
import type { JoinLobbyResult } from "../ClientGameRunner";
import "../GameStartingModal";
import type { GameStartingModal } from "../GameStartingModal";
import "../LangSelector";
import { initLayout } from "../Layout";
import "../styles.css";
import { createMatchConfig } from "./MatchConfig";
import "./style.css";

const form = document.querySelector<HTMLFormElement>("#expedition")!;
const status = document.querySelector<HTMLElement>("#status")!;
const start = document.querySelector<HTMLButtonElement>("#start")!;
let match: JoinLobbyResult | null = null;
let starting = false;
if (new URLSearchParams(location.search).get("software-rendering") === "1") {
  status.textContent =
    "Software rendering test mode enabled; performance may be slow.";
  document.querySelector<HTMLSelectElement>("select[name=map]")!.value =
    GameMapType.Onion;
}
initLayout();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (starting || match) return;
  if (!form.reportValidity()) return;
  starting = true;
  start.disabled = true;
  status.textContent = "Preparing your expedition…";
  try {
    const data = new FormData(form);
    const playerName = String(data.get("name")).trim() || "Explorer";
    const config = createMatchConfig(
      Number(data.get("bots")),
      data.get("difficulty") as Difficulty,
      data.get("map") as GameMapType,
    );
    const gameID = generateID();
    const clientID = generateID();
    const { joinLobby } = await import("../ClientGameRunner");
    document.body.classList.add("in-game");
    const ready = new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        document.removeEventListener("conquest-game-ready", onReady);
        document.removeEventListener("conquest-game-failed", onFailed);
      };
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onFailed = (event: Event) => {
        cleanup();
        reject((event as CustomEvent).detail);
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("Map preparation timed out. Please retry."));
      }, 120_000);
      document.addEventListener("conquest-game-ready", onReady, {
        once: true,
      });
      document.addEventListener("conquest-game-failed", onFailed, {
        once: true,
      });
    });
    document.querySelector<GameStartingModal>("game-starting-modal")!.show();
    match = joinLobby(new EventBus(), {
      gameID,
      playerName,
      playerClanTag: null,
      playerRole: null,
      turnstileToken: null,
      cosmetics: {},
      gameStartInfo: {
        gameID,
        lobbyCreatedAt: Date.now(),
        config,
        players: [
          { clientID, username: playerName, clanTag: null, cosmetics: {} },
        ],
      },
    });
    await ready;
    status.textContent = "Choose your starting territory on the map.";
  } catch (error) {
    match?.stop(true);
    match = null;
    document.body.classList.remove("in-game");
    status.textContent = `Could not start: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    starting = false;
    start.disabled = false;
  }
});

// Reloading gives the inherited renderer/worker a complete, predictable teardown.
// Native unload handling ends the local match; no record is sent to OpenFront.
document.querySelector("#return-menu")!.addEventListener("click", () => {
  if (confirm("End this expedition and return to the menu?")) {
    match?.stop(true);
    window.location.reload();
  }
});
document.addEventListener("leave-lobby", () => {
  match?.stop(true);
  window.location.reload();
});

start.disabled = false;
