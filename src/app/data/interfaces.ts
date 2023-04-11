import { ElementRef, QueryList } from "@angular/core";

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
  type: EGame;
  maxScore: number;
  maxRounds: number;
  winner: Player[];
  round: number;
  extra: ExtraScore;

  saveScore(event: any, index: number, state: GameState, inputs: QueryList<ElementRef> | undefined): void;
  addScoreToTotal(id: number, score: number, state: GameState): void;
  onNextRound(state: GameState, inputs: QueryList<ElementRef>): void;
  sort(list: number[]): number[];
  getExtraLabel(): string;
  onClickExtra(id: number): void;
  calculatePositions(state: GameState): void;
  calculateNumberOfRounds(NumberOfPlayers: number): number;
  validateOnNextRound(state: GameState): boolean 
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
  games: IGame[];
}
