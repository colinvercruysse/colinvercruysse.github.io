import { Game, EGame, Config } from "./interfaces";

export let config: Config = {
    games: [
        {
            name: 'Uno',
            type: EGame.UNO,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: 501,
            winner: undefined,
            round: 0
        },
        {
            name: 'Chinees Poepen',
            type: EGame.CHINEESPOEPEN,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: Number.MAX_SAFE_INTEGER,
            winner: undefined,
            round: 0
        },
        {
            name: 'Nullenspel',
            type: EGame.NULLENSPEL,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: Number.MAX_SAFE_INTEGER,
            winner: undefined, 
            round: 0
        },
        {
            name: 'Phase 10',
            type: EGame.PHASE10,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: Number.MAX_SAFE_INTEGER,
            winner: undefined,
            round: 0
        }
    ]
}