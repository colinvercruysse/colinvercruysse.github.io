import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ElementRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { EGame, GameState, IGame, Player } from "src/app/data/interfaces";
import { GameFactory } from "src/app/games/GameFactory";

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

  constructor(private router: Router) {
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

  /**
   * Add the score to the total of the player.
   * @param id : player id
   * @param score
   */
  // addScoreToTotal(id: number, score: number) {
  //   let state = this.gameState;

  //   state.currentPlayer = id;

  //   let player = state.players.find((p) => p.id === id);

  //   // Add previous total
  //   if (player && state.game.extra === ExtraScore.PREVIOUSTOTAL) {
  //     player.extra = player.total;
  //   }

  //   if (player) {
  //     player.score = score;
  //     player.total = player.total + score;
  //     player.roundFilled = true;
  //   }

  //   // Add nullen
  //   if (player && state.game.extra === ExtraScore.NULLEN) {
  //     if (player.total === 0) {
  //       player.extra = player.extra + 1;
  //     }
  //   }

  //   this.gameState = state;

  //   this.save("currentState", JSON.stringify(this.gameState));
  // }

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

  /**
   * Persist the data to localstorage
   * @param key
   * @param data
   */
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

    this.router.navigate(["/end"]);
  }

  getExtraLabel(): string {
    return "";
    // switch (this.gameState.game.extra) {
    //   case ExtraScore.PREVIOUSTOTAL:
    //     return "Prev.";

    //   case ExtraScore.NULLEN:
    //     return "Nullen";

    //   case ExtraScore.PHASE:
    //     return "Phase";

    //   default:
    //     return "Prev.";
    // }
  }

  onClickExtra(id: number) {
    switch (this.gameState.game.type) {
      case EGame.PHASE10:
        this.addPhase(id);
        break;

      case EGame.NULLENSPEL:
        this.removeNul(id);
        break;

      default:
        break;
    }

    this.save("currentState", JSON.stringify(this.gameState));
  }

  addPhase(id: number) {
    let player = this.gameState.players.find((p) => p.id === id);

    if (player) {
      player.extra = player.extra + 1;
    }

    //this.calculatePositions();
  }

  removeNul(id: number) {
    let player = this.gameState.players.find((p) => p.id === id);

    if (player) {
      player.extra = player.extra === 0 ? 0 : player.extra - 1;
    }
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

  // calculatePositions() {
  //   let state = this.gameState;

  //   // Update positions
  //   let scores: number[] = [];
  //   state.players.forEach((player) => {
  //     scores.push(
  //       state.game.type === EGame.NULLENSPEL ? player.extra : player.total
  //     );
  //   });

  //   let uniqueScores = [...new Set(scores)];

  //   switch (this.gameState.game.type) {
  //     case EGame.UNO:
  //       uniqueScores = this.sortAscending(uniqueScores);
  //       break;

  //     case EGame.CHINEESPOEPEN:
  //       uniqueScores = this.sortDescending(uniqueScores);
  //       break;

  //     case EGame.NULLENSPEL:
  //       uniqueScores = this.sortDescending(uniqueScores);
  //       break;

  //     case EGame.PHASE10:
  //       uniqueScores = this.sortAscending(uniqueScores);
  //       break;

  //     case EGame.NONE_MAX_SCORE:
  //       uniqueScores = this.sortDescending(uniqueScores);
  //       break;

  //     case EGame.NONE_MIN_SCORE:
  //       uniqueScores = this.sortAscending(uniqueScores);
  //       break;

  //     default:
  //       uniqueScores = this.sortDescending(uniqueScores);
  //       break;
  //   }

  //   // Change the players position
  //   if (state.game.type === EGame.PHASE10) {
  //     let unOrderedPlayers = [...state.players];

  //     let combinations: [[number, number]] = [
  //       [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
  //     ];

  //     unOrderedPlayers.forEach((p) => {
  //       combinations.push([p.extra, p.total]);
  //     });

  //     let orderedCombinations = combinations.sort((a, b) => {
  //       if (a[0] === b[0]) {
  //         return a[1] < b[1] ? -1 : 1;
  //       } else {
  //         return a[0] > b[0] ? -1 : 1;
  //       }
  //     });

  //     state.players.forEach((player) => {
  //       let pos =
  //         orderedCombinations.findIndex(
  //           (p) => player.extra === p[0] && player.total === p[1]
  //         ) + 1;

  //       player.position = pos;
  //     });
  //   } else {
  //     state.players.forEach((player) => {
  //       player.position =
  //         uniqueScores.findIndex(
  //           (p) =>
  //             p ===
  //             (state.game.type === EGame.NULLENSPEL
  //               ? player.extra
  //               : player.total)
  //         ) + 1;
  //     });
  //   }

  //   // Persist
  //   this.gameState = state;
  //   this.save("currentState", JSON.stringify(this.gameState));
  // }
}
