export interface GameState {
  players: Player[];
  currentPlayer: number;
  game: Game;
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

export interface Game {
  name: string;
  type: EGame;
  maxScore: number;
  maxRounds: number;
  winner: Player[];
  round: number;
  extra: ExtraScore;

  saveScore(event: any, index: number): void;
  addScoreToTotal(id: number, score: number): void;
  onNextRound(): void;
  sort(list: number[]): number[];
  getExtraLabel(): string;
  onClickExtra(id: number): void;
  calculatePositions(): void;
}

export enum EGame {
  NONE_MIN_SCORE,
  NONE_MAX_SCORE,
  UNO,
  CHINEESPOEPEN,
  NULLENSPEL,
  PHASE10,
}

export enum ExtraScore {
  NULLEN,
  PREVIOUSTOTAL,
  PHASE,
}

export interface Config {
  games: Game[];
}
