export interface GameState {
    players: Player[],
    currentPlayer: number,
    game: Game
}

export interface Player {
    id: number,
    name: string,
    total: number,
    score: number,
    currentRound: number,
    position: number,
    extra: number,
}

export interface Game {
    name: string,
    type: EGame,
    maxScore: number,
    maxRounds: number,
    winner: Player | undefined,
    round: number,
    extra: ExtraScore
}

export enum EGame {
    NONE,
    UNO,
    CHINEESPOEPEN,
    NULLENSPEL,
    PHASE10
}

export enum ExtraScore {
    NULLEN,
    PREVIOUSTOTAL,
    PHASE
}

export interface Config {
    games: Game[]
}