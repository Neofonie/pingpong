<script lang="ts">
  import PlayerForm from './lib/components/PlayerForm.svelte';
  import TournamentBracket from './lib/components/TournamentBracket.svelte';
  import CurrentMatch from './lib/components/CurrentMatch.svelte';
  import WinnerAnimation from './lib/components/WinnerAnimation.svelte';
  import { tournament } from './lib/stores';
  
  function startTournament() {
    tournament.generateMatches();
  }
  
  function resetTournament() {
    tournament.reset();
  }

  function resetMatches() {
    tournament.resetMatches();
  }
</script>

<svelte:head>
  <base href="{import.meta.env.VITE_BASE_PATH || '/'}">
</svelte:head>

<main>
  <h1>Turnier Manager</h1>
  
  <div class="controls">
    <PlayerForm />
    <div class="buttons">
      <button on:click={startTournament} class="start">Turnier starten</button>
      <button on:click={resetMatches} class="reset-matches">Spiele zurücksetzen</button>
      <button on:click={resetTournament} class="reset">Alles zurücksetzen</button>
    </div>
  </div>
  
  <CurrentMatch />
  <TournamentBracket />
  <WinnerAnimation />
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .start {
    background-color: #4CAF50;
    color: white;
  }
  
  .start:hover {
    background-color: #45a049;
  }
  
  .reset-matches {
    background-color: #ff9800;
    color: white;
  }
  
  .reset-matches:hover {
    background-color: #f57c00;
  }
  
  .reset {
    background-color: #f44336;
    color: white;
  }
  
  .reset:hover {
    background-color: #da190b;
  }
</style>
