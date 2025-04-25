<script lang="ts">
  import { tournament } from '../stores';
  import { onMount } from 'svelte';
  
  $: matches = $tournament.matches;
  $: players = $tournament.players;
  
  // Prüfe, ob alle Spiele abgeschlossen sind
  $: allMatchesCompleted = matches.length > 0 && matches.every(match => match.winner);
  
  // Finde den Turniersieger
  $: tournamentWinner = (() => {
    if (!allMatchesCompleted) return null;
    
    // Finde den Spieler, der das letzte Spiel gewonnen hat
    const lastMatch = matches[matches.length - 1];
    return lastMatch.winner;
  })();
  
  $: showAnimation = allMatchesCompleted && tournamentWinner !== null;
  $: winner = showAnimation ? tournamentWinner : null;

  let showTrophy = false;
  let showFireworks = false;

  onMount(() => {
    if (showAnimation) {
      setTimeout(() => {
        showTrophy = true;
      }, 1000);
      setTimeout(() => {
        showFireworks = true;
      }, 1500);
    }
  });
</script>

{#if showAnimation && winner}
  <div class="winner-animation">
    <div class="confetti-container">
      {#each Array(50) as _, i}
        <div class="confetti" style="--delay: {i * 0.1}s; --rotation: {Math.random() * 360}deg; --x: {Math.random() * 100}vw; --y: {Math.random() * 100}vh;">
        </div>
      {/each}
    </div>

    {#if showFireworks}
      <div class="fireworks-container">
        {#each Array(5) as _, i}
          <div class="firework" style="--delay: {i * 0.5}s; --x: {Math.random() * 100}vw;">
            <div class="explosion"></div>
          </div>
        {/each}
      </div>
    {/if}

    <div class="winner-content">
      <h2>Herzlichen Glückwunsch!</h2>
      <h1>{winner.name}</h1>
      <p>hat das Turnier gewonnen!</p>
      {#if showTrophy}
        <div class="trophy">🏆</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .winner-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }

  .confetti-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #f00;
    opacity: 0;
    animation: confetti-fall 3s ease-in forwards;
    animation-delay: var(--delay);
    transform: rotate(var(--rotation));
    left: var(--x);
    top: -10px;
  }

  .confetti:nth-child(3n) { background-color: #0f0; }
  .confetti:nth-child(3n+1) { background-color: #00f; }
  .confetti:nth-child(3n+2) { background-color: #ff0; }

  @keyframes confetti-fall {
    0% {
      opacity: 0;
      transform: translateY(0) rotate(var(--rotation));
    }
    10% {
      opacity: 1;
    }
    100% {
      opacity: 1;
      transform: translateY(100vh) rotate(calc(var(--rotation) + 360deg));
    }
  }

  .fireworks-container {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .firework {
    position: absolute;
    left: var(--x);
    bottom: 0;
    animation: firework-rise 1s ease-out forwards;
    animation-delay: var(--delay);
  }

  .explosion {
    width: 5px;
    height: 5px;
    background: radial-gradient(circle, #ff0, #f00);
    border-radius: 50%;
    animation: firework-explode 0.5s ease-out forwards;
    animation-delay: 1s;
  }

  @keyframes firework-rise {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-50vh);
      opacity: 1;
    }
  }

  @keyframes firework-explode {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(20);
      opacity: 0;
    }
  }

  .winner-content {
    text-align: center;
    color: white;
    z-index: 1001;
    animation: winner-appear 1s ease-out;
  }

  @keyframes winner-appear {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .trophy {
    font-size: 8rem;
    margin: 1rem 0;
    animation: trophy-bounce 1s ease-in-out infinite alternate;
  }

  @keyframes trophy-bounce {
    0% {
      transform: translateY(0) rotate(-10deg);
    }
    100% {
      transform: translateY(-20px) rotate(10deg);
    }
  }

  h1 {
    font-size: 4rem;
    margin: 1rem 0;
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    animation: text-glow 2s ease-in-out infinite alternate;
  }

  @keyframes text-glow {
    0% {
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
    100% {
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6);
    }
  }

  h2 {
    font-size: 2rem;
    margin: 0;
  }

  p {
    font-size: 1.5rem;
    margin: 1rem 0;
  }
</style> 