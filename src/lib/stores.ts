import { writable } from 'svelte/store';
import type { Tournament, Player, Match } from './types';

function createTournamentStore() {
  // Load initial players from localStorage
  const savedPlayers = localStorage.getItem('tournament_players');
  const initialPlayers = savedPlayers ? JSON.parse(savedPlayers) : [];

  const { subscribe, set, update } = writable<Tournament>({
    players: initialPlayers,
    matches: [],
  });

  function getNextPowerOfTwo(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }

  function distributeByesEvenly(players: Player[]): Match[] {
    const totalPlayers = players.length;
    const nextPowerOfTwo = getNextPowerOfTwo(totalPlayers);
    const numberOfByes = nextPowerOfTwo - totalPlayers;
    const matches: Match[] = [];
    let matchId = 1;
    
    // Create a copy of players array
    const shuffledPlayers = [...players];
    
    // Shuffle players randomly
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }
    
    let playerIndex = 0;
    
    // Create first round matches with byes
    while (playerIndex < shuffledPlayers.length) {
      if (numberOfByes > 0 && matches.length < numberOfByes) {
        // This player gets a bye - create a match with only one player
        const match: Match = {
          id: matchId++,
          round: 1,
          player1: shuffledPlayers[playerIndex],
          player2: undefined,
          isActive: false,
          isBye: true
        };
        // Automatically set the winner for bye matches
        match.winner = match.player1;
        matches.push(match);
        playerIndex++;
      } else {
        // Create normal match with two players
        matches.push({
          id: matchId++,
          round: 1,
          player1: shuffledPlayers[playerIndex],
          player2: playerIndex + 1 < shuffledPlayers.length ? shuffledPlayers[playerIndex + 1] : undefined,
          isActive: false,
          isBye: false
        });
        playerIndex += 2;
      }
    }
    
    return matches;
  }

  // Function to save players to localStorage
  function savePlayers(players: Player[]) {
    localStorage.setItem('tournament_players', JSON.stringify(players));
  }

  return {
    subscribe,
    addPlayer: (name: string) => update(state => {
      const newPlayer: Player = {
        id: state.players.length + 1,
        name
      };
      const newState = { ...state, players: [...state.players, newPlayer] };
      savePlayers(newState.players); // Save to localStorage
      return newState;
    }),
    
    generateMatches: () => update(state => {
      const matches = distributeByesEvenly(state.players);
      return { ...state, matches };
    }),

    setMatchWinner: (matchId: number, winner: Player) => update(state => {
      const matches = [...state.matches];
      const currentMatch = matches.find(m => m.id === matchId);
      
      if (!currentMatch) return state;
      
      // Update the current match with the winner
      currentMatch.winner = winner;
      currentMatch.isActive = false;
      
      // Find all completed matches in the current round
      const currentRound = currentMatch.round;
      const completedMatches = matches.filter(
        m => m.round === currentRound && m.winner
      );
      
      // If we have enough winners for the next round, create new matches
      const roundMatches = matches.filter(m => m.round === currentRound);
      if (completedMatches.length === roundMatches.length) {
        const winners = completedMatches.map(m => m.winner!);
        const nextRound = currentRound + 1;
        
        // Create matches for pairs of winners
        for (let i = 0; i < winners.length; i += 2) {
          if (winners[i + 1]) { // Only create match if we have two players
            matches.push({
              id: matches.length + 1,
              round: nextRound,
              player1: winners[i],
              player2: winners[i + 1],
              isActive: false,
              isBye: false
            });
          } else if (winners[i]) {
            // If there's an odd number of winners, the last one gets a bye
            matches.push({
              id: matches.length + 1,
              round: nextRound,
              player1: winners[i],
              player2: undefined,
              isActive: false,
              isBye: true,
              winner: winners[i] // Auto-advance single player
            });
          }
        }
      }
      
      return { ...state, matches };
    }),

    setActiveMatch: (matchId: number) => update(state => {
      const matches = state.matches.map(match => ({
        ...match,
        isActive: match.id === matchId
      }));
      
      const currentMatch = matches.find(m => m.id === matchId);
      return { ...state, matches, currentMatch };
    }),

    resetMatches: () => update(state => {
      return { ...state, matches: [], currentMatch: undefined };
    }),

    reset: () => {
      localStorage.removeItem('tournament_players'); // Clear localStorage
      set({ players: [], matches: [] });
    }
  };
}

export const tournament = createTournamentStore(); 