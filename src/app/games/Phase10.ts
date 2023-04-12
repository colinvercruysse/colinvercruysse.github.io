import { EGame, ExtraScore, GameState, IGame, Player } from "../data/interfaces";

export class Phase10 implements IGame {
    name: string = "Phase 10";
    type: EGame = EGame.PHASE10;
    maxScore: number = Number.MAX_SAFE_INTEGER;
    maxRounds: number = Number.MAX_SAFE_INTEGER;
    winner: Player[] = [];
    round: number = 1;
    extra: ExtraScore = ExtraScore.PHASE;

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
        }

        this.save("currentState", JSON.stringify(state));
    }

    sort(list: number[]): number[] {
        return list.sort((a, b) => {
            return a - b;
        });
    }

    getExtraLabel(): string {
        return "Phase";
    }

    onClickExtra(id: number, state: GameState): void {
        this.addPhase(id, state);
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
        let unOrderedPlayers = [...state.players];

        let combinations: [[number, number]] = [
            [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
        ];

        unOrderedPlayers.forEach((p) => {
            combinations.push([p.extra, p.total]);
        });

        let orderedCombinations = combinations.sort((a, b) => {
            if (a[0] === b[0]) {
                return a[1] < b[1] ? -1 : 1;
            } else {
                return a[0] > b[0] ? -1 : 1;
            }
        });

        state.players.forEach((player) => {
            let pos =
                orderedCombinations.findIndex(
                    (p) => player.extra === p[0] && player.total === p[1]
                ) + 1;

            player.position = pos;
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

    addPhase(id: number, state: GameState) {
        let player = state.players.find((p) => p.id === id);

        if (player) {
            player.extra = player.extra + 1;
        }

        this.calculatePositions(state);
    }
}