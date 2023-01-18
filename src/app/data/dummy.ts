import { EGame, ExtraScore, GameState } from "./interfaces";

export let state: GameState = {
    players: [
      {
        id: 0,
        name: 'Colin',
        score: 0,
        currentRound: 0,
        total: 0,
        position: 0,
        extra: 0,
      }, 
      {
        id: 1,
        name: 'Chadia',
        score: 0,
        total: 0,
        currentRound: 0,
        position: 1,
        extra: 0,
      },
      {
        id: 2,
        name: 'Sam',
        score: 0,
        total: 0,
        currentRound: 0,
        position: 2,
        extra: 0,
      },
      {
        id: 3,
        name: 'Tucker',
        score: 0,
        total: 0,
        currentRound: 0,
        position: 3,
        extra: 0,
      }
    ],
    currentPlayer: 0,
    game: {
      name: 'Uno',
      type: EGame.UNO,
      maxScore: 501,
      winner: undefined,
      maxRounds: Number.MAX_SAFE_INTEGER,
      round: 0,
      extra: ExtraScore.PREVIOUSTOTAL
    }
  }