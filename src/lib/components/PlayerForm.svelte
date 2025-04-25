<script lang="ts">
  import { tournament } from '../stores';
  
  let playerName = '';
  
  $: players = $tournament.players;
  
  function handleSubmit() {
    if (playerName.trim()) {
      tournament.addPlayer(playerName.trim());
      playerName = '';
    }
  }
</script>

<div class="player-section">
  <form on:submit|preventDefault={handleSubmit} class="player-form">
    <input
      type="text"
      bind:value={playerName}
      placeholder="Spielername eingeben"
      required
    />
    <button type="submit">Hinzufügen</button>
  </form>

  <div class="player-list">
    <h3>Teilnehmende Spieler ({players.length})</h3>
    {#if players.length === 0}
      <p class="empty-message">Noch keine Spieler hinzugefügt</p>
    {:else}
      <ul>
        {#each players as player}
          <li>{player.name}</li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .player-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
  }

  .player-form {
    display: flex;
    gap: 0.5rem;
  }
  
  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
  }
  
  button:hover {
    background-color: #45a049;
  }

  .player-list {
    background-color: var(--background-color);
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: var(--text-color);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-color);
  }

  li:last-child {
    border-bottom: none;
  }

  .empty-message {
    color: var(--text-color-secondary);
    font-style: italic;
  }
</style> 