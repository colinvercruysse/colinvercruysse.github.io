import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { GameState, IGame, Player } from "src/app/data/interfaces";
import { GameFactory } from "src/app/games/GameFactory";
import { GameStateService } from "src/app/services/game.service";

@Component({
  selector: "app-gamegrid",
  templateUrl: "./gamegrid.component.html",
  styleUrls: ["./gamegrid.component.scss"],
})
export class GamegridComponent implements OnInit {
  /**
   * The game state will be stored in the local storage of the device.
   * It will be updated after every change, so no data will be lost.
   * Key = currentState
   */
  public gameState: GameState;

  /**
   * All colums displayed in the game grid.
   */
  displayedColumns: string[] = ["position", "name", "score", "extra", "total"];

  /**
   * List of all imput elements, inside the game grid.
   */
  @ViewChildren("input") inputs: QueryList<ElementRef> | undefined;

  public game: IGame;

  constructor(private router: Router, private gameStateService: GameStateService) {
    let s: GameState;

    s = JSON.parse(localStorage.getItem("currentState") ?? "");
    this.gameState = s;

    this.game = new GameFactory().getGame(this.gameState.game.name);
  }

  ngOnInit(): void { }

  /**
   * Save the score to memory and calculate the positions.
   * @param event : yields the value of the input field.
   * @param index : index of the input field, corresponds to the player id.
   */
  saveScore(event: any, index: number) {
    this.game.saveScore(event, index, this.gameState);

    // Clear the input field.
    event.target.value = "";

    // Change focus to the next input or go to next round
    if (index === this.gameState.players.length - 1) {
      if (this.validateOnNextRound()) {
        this.onNextRound();
      } else {
        // Go to the first element that has not filled in the score
        let first = this.gameState.players.findIndex((p) => !p.roundFilled);

        if (first > -1) this.inputs?.toArray()[first].nativeElement.focus();
      }
    } else {
      if (this.validateOnNextRound()) {
        this.onNextRound();
      }
      this.inputs?.toArray()[index + 1].nativeElement.focus();
    }

    this.game.calculatePositions(this.gameState);
  }

  onNextRound() {
    let state = this.gameState;

    // Add round to each player and set all players to class toBeFilled
    state.players.forEach((player) => {
      player.currentRound = player.currentRound + 1;
      player.roundFilled = false;
    });

    // Add round to game
    state.game.round = state.game.round + 1;

    this.game.calculatePositions(this.gameState);

    // Change focus to the first input
    this.inputs?.toArray()[0].nativeElement.focus();

    if (
      this.gameState.players[0].currentRound === this.gameState.game.maxRounds
    ) {
      this.onEndGame();
    }
  }

  navigateToHomescreen() {
    this.router.navigate(["/home"]);
  }

  save(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  calculateWinner(state: GameState): Player[] {
    let winners = state.players.filter((p) => p.position === 1);

    return winners.length > 0
      ? winners
      : [
        {
          id: Number.MAX_SAFE_INTEGER,
          name: "No winner",
          currentRound: state.players[0].currentRound,
          extra: Number.MAX_SAFE_INTEGER,
          position: 1,
          score: Number.MAX_SAFE_INTEGER,
          total: Number.MAX_SAFE_INTEGER,
          roundFilled: false,
        },
      ];
  }

  onEndGame() {
    let winners = this.calculateWinner(this.gameState);
    this.save("winners", JSON.stringify(winners));

    this.persist();

    this.router.navigate(["/end"]);
  }

  getNgClass(player: Player): string {
    let base = "small";

    if (player.position === 1) {
      return base + " first";
    }

    let worstPosition = Math.max(
      ...this.gameState.players.map((p) => p.position)
    );

    if (player.position === worstPosition) {
      return base + " last";
    }

    return base + " mid";
  }

  validateOnNextRound(): boolean {
    let res = true;

    for (let i = 0; i < this.gameState.players.length; i++) {
      if (!this.gameState.players[i].roundFilled) return false;
    }

    return res;
  }

  persist(): void {
    // Persist game state to database
    this.gameStateService.create(this.gameState).then(() => {
      // console.log(this.gameState);
    });
  }
}
