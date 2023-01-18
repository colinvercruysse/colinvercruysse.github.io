import { Game, EGame, Config, ExtraScore } from "./interfaces";

export let config: Config = {
    games: [
        {
            name: 'Uno',
            type: EGame.UNO,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: 501,
            winner: undefined,
            round: 1,
            extra: ExtraScore.PREVIOUSTOTAL
        },
        {
            name: 'Chinees Poepen',
            type: EGame.CHINEESPOEPEN,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: Number.MAX_SAFE_INTEGER,
            winner: undefined,
            round: 1,
            extra: ExtraScore.PREVIOUSTOTAL
        },
        {
            name: 'Nullenspel',
            type: EGame.NULLENSPEL,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: Number.MAX_SAFE_INTEGER,
            winner: undefined, 
            round: 1,
            extra: ExtraScore.NULLEN
        },
        {
            name: 'Phase 10',
            type: EGame.PHASE10,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: Number.MAX_SAFE_INTEGER,
            winner: undefined,
            round: 1,
            extra: ExtraScore.PHASE
        },
        {
            name: 'Regular scoreboard',
            type: EGame.NONE,
            maxRounds: Number.MAX_SAFE_INTEGER,
            maxScore: Number.MAX_SAFE_INTEGER,
            round: 1,
            winner: undefined,
            extra: ExtraScore.PREVIOUSTOTAL
        }
    ]
}