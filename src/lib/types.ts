export interface Player {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  round: number;
  player1?: Player;
  player2?: Player;
  winner?: Player;
  isActive: boolean;
  isBye: boolean;
}

export interface Tournament {
  players: Player[];
  matches: Match[];
  currentMatch?: Match;
} 