<script lang="ts">
  import { tournament } from "../stores";
  $: currentMatch = $tournament.currentMatch;

  let player1Score = 0;
  let player2Score = 0;

  // Wer hat Angabe? 'player1' oder 'player2'
  let currentServer: "player1" | "player2" | null = null;
  let serveCount = 1; // 1 bis 3

  function selectServer(player: "player1" | "player2") {
    currentServer = player;
    serveCount = 1;
  }

  function updateScore(player: "player1" | "player2", increment: boolean) {
    if (player === "player1") {
      player1Score = increment
        ? player1Score + 1
        : Math.max(0, player1Score - 1);
    } else {
      player2Score = increment
        ? player2Score + 1
        : Math.max(0, player2Score - 1);
    }

    // Angabe immer hochzählen, wenn ein Punkt gemacht wird und ein Aufschläger gesetzt ist
    if (increment && currentServer) {
      if (serveCount < 3) {
        serveCount += 1;
      } else {
        // Nach 3 Angaben wechselt der Aufschläger
        currentServer = currentServer === "player1" ? "player2" : "player1";
        serveCount = 1;
      }
    }

    // Gewinnbedingung prüfen
    if (
      player1Score >= 11 &&
      player1Score - player2Score >= 2 &&
      currentMatch?.player1
    ) {
      setWinner(currentMatch.player1);
    } else if (
      player2Score >= 11 &&
      player2Score - player1Score >= 2 &&
      currentMatch?.player2
    ) {
      setWinner(currentMatch.player2);
    }
  }

  function setWinner(winner) {
    if (currentMatch) {
      tournament.setMatchWinner(currentMatch.id, winner);
      resetScores();
    }
  }

  function resetScores() {
    player1Score = 0;
    player2Score = 0;
    // currentServer und serveCount NICHT zurücksetzen!
    // currentServer = null;
    // serveCount = 1;
  }

  // Nur Scores zurücksetzen, nicht den Aufschläger!
  $: if (currentMatch) {
    resetScores();
  }
</script>

<div class="current-match">
  {#if currentMatch}
    <h2>Aktuelles Spiel</h2>
    <div class="match-display">
      <div
        class="player-card"
        class:selected={currentServer === "player1"}
        on:click={() => selectServer("player1")}
      >
        <h3>{currentMatch.player1?.name || "TBD"}</h3>
        <div class="score-section">
          <div class="score-control">
            <button
              class="score-button minus"
              on:click={() => updateScore("player1", false)}>-</button
            >
            <span class="score">{player1Score}</span>
            <button
              class="score-button plus"
              on:click={() => updateScore("player1", true)}>+</button
            >
          </div>
          <button
            on:click={() => setWinner(currentMatch.player1)}
            class="winner-button"
          >
            Als Gewinner markieren
          </button>
        </div>
      </div>

      <div class="serve-section">
        {#if currentServer}
          <div>
            <span
              >Angabe: {currentServer === "player1"
                ? currentMatch.player1?.name
                : currentMatch.player2?.name}</span
            >
            <div class="serve-count">{serveCount} / 3</div>
          </div>
        {:else}
          <span>Wer hat Angabe? (Spielerbox klicken)</span>
        {/if}
      </div>

      <div
        class="player-card"
        class:selected={currentServer === "player2"}
        on:click={() => selectServer("player2")}
      >
        <h3>{currentMatch.player2?.name || "TBD"}</h3>
        <div class="score-section">
          <div class="score-control">
            <button
              class="score-button minus"
              on:click={() => updateScore("player2", false)}>-</button
            >
            <span class="score">{player2Score}</span>
            <button
              class="score-button plus"
              on:click={() => updateScore("player2", true)}>+</button
            >
          </div>
          <button
            on:click={() => setWinner(currentMatch.player2)}
            class="winner-button"
          >
            Als Gewinner markieren
          </button>
        </div>
      </div>
    </div>
  {:else}
    <p>Kein aktives Spiel ausgewählt</p>
  {/if}
</div>

<style>
  .match-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .player-card {
    flex: 1;
    text-align: center;
    padding: 1rem;
    background-color: var(--card-background);
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border 0.2s;
  }
  .player-card.selected {
    border: 2px solid #ffd700;
    box-shadow: 0 0 10px #ffd70088;
  }
  .serve-section {
    min-width: 180px;
    text-align: center;
    font-size: 1.2rem;
    color: #ffd700;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .serve-count {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 0.5rem;
  }

  .current-match {
    margin: 2rem 0;
    padding: 2rem;
    background-color: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .vs {
    margin: 0 2rem;
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-color-secondary);
  }

  .winner-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .winner-button:hover {
    background-color: #45a049;
  }

  h2 {
    margin: 0;
    color: var(--text-color);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: var(--text-color);
  }

  .score-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .markers {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .marker {
    width: 24px;
    height: 24px;
    border: 2px solid var(--border-color);
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    background: var(--background-color);
  }

  .marker.filled {
    background: #4caf50;
    border-color: #4caf50;
  }

  .score-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .score {
    font-size: 1.5rem;
    font-weight: bold;
    min-width: 2rem;
    color: var(--text-color);
  }

  .score-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .score-button.minus {
    background-color: #f44336;
  }

  .score-button.plus {
    background-color: #4caf50;
  }

  .score-button:hover {
    opacity: 0.9;
  }
</style>
