import { ExtraScore, GameState, IGame, Player } from "../data/interfaces";

export class Nullenspel implements IGame {
    name: string = "Nullenspel";
    maxScore: number = Number.MAX_SAFE_INTEGER;
    maxRounds: number = Number.MAX_SAFE_INTEGER;
    winner: Player[] = [];
    round: number = 1;
    extra: ExtraScore = ExtraScore.NULLEN;

    constructor() {
    }

    saveScore(event: any, index: number, state: GameState): void {
        if (event.target && event.target.value) {
            this.addScoreToTotal(index, parseInt(event.target.value), state);
        }
    }

    addScoreToTotal(id: number, score: number, state: GameState): void {
        state.currentPlayer = id;

        let player = state.players.find((p) => p.id === id);

        if (player) {
            player.score = score;
            player.total = player.total + score;
            player.roundFilled = true;

            // Add nullen
            if (player.total === 0) {
                player.extra = player.extra + 1;
            }
        }

        this.save("currentState", JSON.stringify(state));
    }

    sort(list: number[]): number[] {
        return list.sort((a, b) => {
            return b - a;
        });
    }

    getExtraLabel(): string {
        return "Nullen";
    }

    onClickExtra(id: number, state: GameState): void {
        this.removeNul(id, state);
    }

    calculatePositions(state: GameState): void {
        // Update positions
        let scores: number[] = [];
        state.players.forEach((player) => {
            scores.push(player.extra);
        });

        let uniqueScores = [...new Set(scores)];

        uniqueScores = this.sort(uniqueScores);

        // Change the players position
        state.players.forEach((player) => {
            player.position = uniqueScores.findIndex((p) => p === player.extra) + 1;
        });

        // Persist
        this.save("currentState", JSON.stringify(state));
    }

    calculateNumberOfRounds(numberOfPlayers: number): number {
        return Math.floor(52 / numberOfPlayers) * 2 + 1;
    }

    save(key: string, data: string) {
        localStorage.setItem(key, data);
    }

    removeNul(id: number, state: GameState) {
        let player = state.players.find((p) => p.id === id);

        if (player) {
            player.extra = player.extra === 0 ? 0 : player.extra - 1;
        }
    }
}