<script lang="ts">
  import { tournament } from "../stores";
  import type { Match } from "../types";

  $: matches = $tournament.matches;

  function handleMatchClick(match: Match) {
    if (!match.winner) {
      tournament.setActiveMatch(match.id);
    }
  }
</script>

<div class="tournament-bracket">
  {#if matches.length === 0}
    <p>Fügen Sie Spieler hinzu und starten Sie das Turnier</p>
  {:else}
    <div class="rounds">
      {#each Array.from(new Set(matches.map((m) => m.round)))
        // Nur Runden anzeigen, in denen mindestens ein Match zwei Spieler hat
        .filter((round) => matches
            .filter((m) => m.round === round)
            .some((m) => m.player1?.name && m.player2?.name)) as round}
        <div class="round">
          <h3>Runde {round}</h3>
          <div class="matches">
            {#each matches.filter((m) => m.round === round) as match}
              <div
                class="match"
                class:active={match.isActive}
                class:completed={match.winner}
                on:click={() => handleMatchClick(match)}
              >
                <div
                  class="player"
                  class:winner={match.winner === match.player1}
                >
                  {match.player1?.name || "TBD"}
                </div>
                <div class="vs">vs</div>
                <div
                  class="player"
                  class:winner={match.winner === match.player2}
                >
                  {match.player2?.name || "TBD"}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .tournament-bracket {
    margin: 2rem 0;
    padding: 1rem;
    background-color: var(--background-color);
    border-radius: 8px;
  }

  .rounds {
    display: flex;
    gap: 2rem;
  }

  .round {
    min-width: 200px;
  }

  .matches {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .match {
    background: var(--card-background);
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .match.active {
    border: 2px solid #4caf50;
  }

  .match.completed {
    background-color: var(--completed-match-background);
  }

  .player {
    padding: 0.5rem;
    border-radius: 4px;
    color: var(--text-color);
  }

  .player.winner {
    background-color: #4caf50;
    color: white;
  }

  .vs {
    text-align: center;
    color: var(--text-color-secondary);
    margin: 0.5rem 0;
  }
</style>
