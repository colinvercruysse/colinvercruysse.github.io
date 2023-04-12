
export interface GameState {
  players: Player[];
  currentPlayer: number;
  game: IGame;
}

export interface Player {
  id: number;
  name: string;
  total: number;
  score: number;
  currentRound: number;
  position: number;
  extra: number;
  roundFilled: boolean;
}

export interface IGame {
  name: string;
  maxScore: number;
  maxRounds: number;
  winner: Player[];
  round: number;
  extra: ExtraScore;

  saveScore(event: any, index: number, state: GameState): void;
  addScoreToTotal(id: number, score: number, state: GameState): void;
  sort(list: number[]): number[];
  getExtraLabel(): string;
  onClickExtra(id: number, state: GameState): void;
  calculatePositions(state: GameState): void;
  calculateNumberOfRounds(numberOfPlayers: number): number;
}

export enum ExtraScore {
  NULLEN,
  PREVIOUSTOTAL,
  PHASE,
}

export interface Config {
  games: IGame[];
}
