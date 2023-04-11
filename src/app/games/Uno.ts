import { ElementRef, QueryList } from "@angular/core";
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

    s = JSON.parse(localStorage.getItem("currentState") ?? "{}");

    this.gameState = s;
  }

  calculateNumberOfRounds(NumberOfPlayers: number): number {
    return Number.MAX_SAFE_INTEGER
  }

  saveScore(event: any, index: number, state: GameState, inputs: QueryList<ElementRef> | undefined): void {
    if (event.target && event.target.value) {
      this.addScoreToTotal(index, parseInt(event.target.value), state);
    }

    // Clear the input field.
    event.target.value = "";

    // Todo: Change focus to the next input or go to next round
    // Change focus to the next input or go to next round
    if (index === this.gameState.players.length - 1) {
      if (this.validateOnNextRound(state)) {
        this.onNextRound(state, inputs!);
      } else {
        // Go to the first element that has not filled in the score
        let first = this.gameState.players.findIndex((p) => !p.roundFilled);

        if (first > -1) inputs?.toArray()[first].nativeElement.focus();
      }
    } else {
      if (this.validateOnNextRound(state)) {
        this.onNextRound(state, inputs!);
      }
      inputs?.toArray()[index + 1].nativeElement.focus();
    }

    this.calculatePositions(state);
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

  onNextRound(state: GameState, inputs: QueryList<ElementRef>): void {
    // Add round to each player and set all players to class toBeFilled
    state.players.forEach((player) => {
      player.currentRound = player.currentRound + 1;
      player.roundFilled = false;
    });

    // Add round to game
    state.game.round = state.game.round + 1;

    this.calculatePositions(state);

    // Change focus to the first input
    inputs?.toArray()[0].nativeElement.focus();

    if (
      state.players[0].currentRound === state.game.maxRounds
    ) {
      // this.onEndGame();
    }
  }

  sort(list: number[]): number[] {
    return list.sort((a, b) => {
      return a - b;
    });
  }

  public getExtraLabel(): string {
    return "Prev.";
  }

  public onClickExtra(id: number): void {
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

  /**
   * Persist the data to localstorage
   * @param key
   * @param data
   */
  save(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  validateOnNextRound(state: GameState): boolean {
    let res = true;

    for (let i = 0; i < state.players.length; i++) {
      if (!state.players[i].roundFilled) return false;
    }

    return res;
  }
}
