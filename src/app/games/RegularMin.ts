import { ExtraScore, GameState, IGame, Player } from "../data/interfaces";

export class RegularMin implements IGame {
    name: string = "Regular min";
    maxScore: number = Number.MIN_SAFE_INTEGER;
    maxRounds: number = Number.MAX_SAFE_INTEGER;
    winner: Player[] = [];
    round: number = 1;
    extra: ExtraScore = ExtraScore.PREVIOUSTOTAL;

    saveScore(event: any, index: number, state: GameState): void {
        if (event.target && event.target.value) {
            this.addScoreToTotal(index, parseInt(event.target.value), state);
        }
    }

    addScoreToTotal(id: number, score: number, state: GameState): void {
        state.currentPlayer = id;

        let player = state.players.find((p) => p.id === id);

        if (player) {
            // Add previous to total
            player.extra = player.total;

            player.score = score;
            player.total = player.total + score;
            player.roundFilled = true;
        }

        this.save("currentState", JSON.stringify(state));
    }

    sort(list: number[]): number[] {
        return list.sort((a, b) => {
            return a - b;
        });
    }

    getExtraLabel(): string {
        return "Prev.";
    }

    onClickExtra(id: number, state: GameState): void {
        return;
    }

    calculatePositions(state: GameState): void {
        // Update positions
        let scores: number[] = [];
        state.players.forEach((player) => {
            scores.push(player.total);
        });

        let uniqueScores = [...new Set(scores)];

        uniqueScores = this.sort(uniqueScores);

        // Change the players position
        state.players.forEach((player) => {
            player.position = uniqueScores.findIndex((p) => p === player.total) + 1;
        });

        // Persist
        this.save("currentState", JSON.stringify(state));
    }

    calculateNumberOfRounds(numberOfPlayers: number): number {
        return Number.MAX_SAFE_INTEGER;
    }

    save(key: string, data: string) {
        localStorage.setItem(key, data);
    }
}