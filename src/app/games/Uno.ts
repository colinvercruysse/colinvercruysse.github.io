import { EGame, ExtraScore, IGame, GameState, Player } from "../data/interfaces";

export class Uno implements IGame {
  name: string = "Uno";
  type: EGame = EGame.UNO;
  maxRounds: number = Number.MAX_SAFE_INTEGER;
  maxScore: number = 501;
  winner: Player[] = [];
  round: number = 1;
  extra: ExtraScore = ExtraScore.PREVIOUSTOTAL;

  public gameState: GameState;

  constructor() {
    let s: GameState;

    s = JSON.parse(localStorage.getItem("currentState") ?? "");

    this.gameState = s;
  }

  calculateNumberOfRounds(NumberOfPlayers: number): number {
    return Number.MAX_SAFE_INTEGER
  }

  saveScore(event: any, index: number): void {
    if (event.target && event.target.value) {
      this.addScoreToTotal(index, parseInt(event.target.value));
    }

    // Clear the input field.
    event.target.value = "";

    // Todo: Change focus to the next input or go to next round

    this.calculatePositions();
  }

  addScoreToTotal(id: number, score: number): void {
    let state = this.gameState;

    state.currentPlayer = id;

    let player = state.players.find((p) => p.id === id);

    if (player) {
      // Add previous to total
      player.extra = player.total;

      player.score = score;
      player.total = player.total + score;
      player.roundFilled = true;
    }

    this.gameState = state;

    this.save("currentState", JSON.stringify(this.gameState));
  }
  onNextRound(): void {
    let state = this.gameState;

    // Add round to each player and set all players to class toBeFilled
    state.players.forEach((player) => {
      player.currentRound = player.currentRound + 1;
      player.roundFilled = false;
    });

    // Add round to game
    state.game.round = state.game.round + 1;

    this.calculatePositions();

    // Todo: Change focus to the first input

    if (
      this.gameState.players[0].currentRound === this.gameState.game.maxRounds
    ) {
      // this.onEndGame();
    }
  }

  sort(list: number[]): number[] {
    return list.sort((a, b) => {
      return a - b;
    });
  }

  getExtraLabel(): string {
    return "Prev.";
  }

  onClickExtra(id: number): void {
    return;
  }

  calculatePositions(): void {
    let state = this.gameState;

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
    this.gameState = state;
    this.save("currentState", JSON.stringify(this.gameState));
  }

  /**
   * Persist the data to localstorage
   * @param key
   * @param data
   */
  save(key: string, data: string) {
    localStorage.setItem(key, data);
  }
}
