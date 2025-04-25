<script lang="ts">
  import { tournament } from '../stores';
  
  $: currentMatch = $tournament.currentMatch;

  // State für Punkte und Marker
  let player1Score = 0;
  let player2Score = 0;
  let player1Markers = [false, false, false];
  let player2Markers = [false, false, false];
  
  function setWinner(winner) {
    if (currentMatch) {
      tournament.setMatchWinner(currentMatch.id, winner);
      // Reset scores and markers after setting winner
      resetScores();
    }
  }

  function updateScore(player: 'player1' | 'player2', increment: boolean) {
    if (player === 'player1') {
      player1Score = increment ? player1Score + 1 : Math.max(0, player1Score - 1);
    } else {
      player2Score = increment ? player2Score + 1 : Math.max(0, player2Score - 1);
    }

    // Prüfe auf Gewinnbedingungen
    if (player1Score >= 11 && player1Score - player2Score >= 2 && currentMatch?.player1) {
      setWinner(currentMatch.player1);
    } else if (player2Score >= 11 && player2Score - player1Score >= 2 && currentMatch?.player2) {
      setWinner(currentMatch.player2);
    }
  }

  function toggleMarker(player: 'player1' | 'player2', index: number) {
    if (player === 'player1') {
      player1Markers[index] = !player1Markers[index];
      player1Markers = [...player1Markers]; // Trigger reactivity
    } else {
      player2Markers[index] = !player2Markers[index];
      player2Markers = [...player2Markers]; // Trigger reactivity
    }
  }

  function resetScores() {
    player1Score = 0;
    player2Score = 0;
    player1Markers = [false, false, false];
    player2Markers = [false, false, false];
  }

  // Reset scores when match changes
  $: if (currentMatch) {
    resetScores();
  }
</script>

<div class="current-match">
  {#if currentMatch}
    <h2>Aktuelles Spiel</h2>
    <div class="match-display">
      <div class="player-card">
        <h3>{currentMatch.player1?.name || 'TBD'}</h3>
        {#if currentMatch.player1}
          <div class="score-section">
            <div class="markers">
              {#each player1Markers as marker, i}
                <button 
                  class="marker" 
                  class:filled={marker}
                  on:click={() => toggleMarker('player1', i)}
                />
              {/each}
            </div>
            <div class="score-control">
              <button class="score-button minus" on:click={() => updateScore('player1', false)}>-</button>
              <span class="score">{player1Score}</span>
              <button class="score-button plus" on:click={() => updateScore('player1', true)}>+</button>
            </div>
            <button 
              on:click={() => setWinner(currentMatch.player1)}
              class="winner-button"
            >
              Als Gewinner markieren
            </button>
          </div>
        {/if}
      </div>
      
      <div class="vs">VS</div>
      
      <div class="player-card">
        <h3>{currentMatch.player2?.name || 'TBD'}</h3>
        {#if currentMatch.player2}
          <div class="score-section">
            <div class="markers">
              {#each player2Markers as marker, i}
                <button 
                  class="marker" 
                  class:filled={marker}
                  on:click={() => toggleMarker('player2', i)}
                />
              {/each}
            </div>
            <div class="score-control">
              <button class="score-button minus" on:click={() => updateScore('player2', false)}>-</button>
              <span class="score">{player2Score}</span>
              <button class="score-button plus" on:click={() => updateScore('player2', true)}>+</button>
            </div>
            <button 
              on:click={() => setWinner(currentMatch.player2)}
              class="winner-button"
            >
              Als Gewinner markieren
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <p>Kein aktives Spiel ausgewählt</p>
  {/if}
</div>

<style>
  .current-match {
    margin: 2rem 0;
    padding: 2rem;
    background-color: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
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
    background-color: #4CAF50;
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
    background: #4CAF50;
    border-color: #4CAF50;
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
    background-color: #4CAF50;
  }

  .score-button:hover {
    opacity: 0.9;
  }
</style> 