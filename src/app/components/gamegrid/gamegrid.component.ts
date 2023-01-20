import { Component, Input, OnInit } from "@angular/core";
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { Router } from "@angular/router";
import { EGame, ExtraScore, GameState, Player } from "src/app/data/interfaces";
import { state } from "../../data/dummy";
import { BottomsheetComponent } from "../bottomsheet/bottomsheet.component";

@Component({
  selector: "app-gamegrid",
  templateUrl: "./gamegrid.component.html",
  styleUrls: ["./gamegrid.component.scss"],
})
export class GamegridComponent implements OnInit {
  public gameState: GameState;

  displayedColumns: string[] = ["position", "name", "score", "extra", "total"];

  constructor(private _bottomSheet: MatBottomSheet, private router: Router) {
    let s: GameState;

    if (localStorage.getItem("currentState")) {
      s = JSON.parse(localStorage.getItem("currentState") ?? "");
    } else {
      s = state;
    }
    this.gameState = s;
  }

  ngOnInit(): void {}

  saveScore(event: any, index: number) {
    if (event.target && event.target.value) {
      this.addScoreToTotal(index, parseInt(event.target.value));
    }

    event.target.value = "";
  }

  addScoreToTotal(id: number, score: number) {
    let state = this.gameState;

    state.currentPlayer = id;

    let player = state.players.find((p) => p.id === id);

    // Add previous total
    if (player && state.game.extra === ExtraScore.PREVIOUSTOTAL) {
      player.extra = player.total;
    }

    if (player) {
      player.score = score;
      player.total = player.total + score;
    }

    // Add nullen
    if (player && state.game.extra === ExtraScore.NULLEN) {
      if (player.total === 0) {
        player.extra = player.extra + 1;
      }
    }

    this.gameState = state;
  }

  onNextRound() {
    let state = this.gameState;

    // Add round to each player
    state.players.forEach(
      (player) => (player.currentRound = player.currentRound + 1)
    );

    // Add round to game
    state.game.round = state.game.round + 1;

    /**
     * Update positions
     */
    let scores: number[] = [];
    state.players.forEach((player) => {
      scores.push(
        state.game.type === EGame.NULLENSPEL ? player.extra : player.total
      );
    });

    let uniqueScores = [...new Set(scores)];

    let orderedPlayers = [...state.players];
    switch (this.gameState.game.type) {
      case EGame.UNO:
        orderedPlayers = this.orderLeastPointsFirst(state);
        uniqueScores = this.sortAscending(uniqueScores);
        break;

      case EGame.CHINEESPOEPEN:
        orderedPlayers = this.orderMostPointsFirst(state);
        uniqueScores = this.sortDescending(uniqueScores);
        break;

      case EGame.NULLENSPEL:
        orderedPlayers = this.orderExtra(state);
        uniqueScores = this.sortDescending(uniqueScores);
        break;

      case EGame.PHASE10:
        orderedPlayers = this.orderLeastPointsFirst(state);
        uniqueScores = this.sortAscending(uniqueScores);
        break;

      case EGame.NONE_MAX_SCORE:
        orderedPlayers = this.orderMostPointsFirst(state);
        uniqueScores = this.sortDescending(uniqueScores);
        break;

      case EGame.NONE_MIN_SCORE:
        orderedPlayers = this.orderLeastPointsFirst(state);
        uniqueScores = this.sortAscending(uniqueScores);
        break;

      default:
        orderedPlayers = this.orderMostPointsFirst(state);
        uniqueScores = this.sortDescending(uniqueScores);
        break;
    }

    state.players.forEach((player) => {
      /**
       * 1. Get unique values from all totals / extras
       * 2. Order these from large -> small or small -> large (based on config)
       * 3. position = index of this number
       */
      player.position =
        uniqueScores.findIndex(
          (p) =>
            p ===
            (state.game.type === EGame.NULLENSPEL ? player.extra : player.total)
        ) + 1;
    });

    // Persist
    this.gameState = state;
    this.save("currentState", JSON.stringify(this.gameState));

    if (
      this.gameState.players[0].currentRound === this.gameState.game.maxRounds
    ) {
      this.onEndGame();
    }
  }

  navigateToHomescreen() {
    this.closeBottomSheet();
    this.router.navigate(["/home"]);
  }

  /**
   * From high to low
   * @param list
   * @returns
   */
  sortDescending(list: number[]): number[] {
    return list.sort((a, b) => {
      return b - a;
    });
  }

  /**
   * From low to high
   * @param list
   * @returns
   */
  sortAscending(list: number[]): number[] {
    return list.sort((a, b) => {
      return a - b;
    });
  }

  orderMostPointsFirst(state: GameState): Player[] {
    return [...state.players].sort((a, b) => {
      if (a.total > b.total) return -1;
      else if (a.total < b.total) return 1;
      else return 0;
    });
  }

  orderExtra(state: GameState): Player[] {
    return [...state.players].sort((a, b) => {
      if (a.extra > b.extra) return -1;
      else if (a.extra < b.extra) return 1;
      else return 0;
    });
  }

  orderLeastPointsFirst(state: GameState): Player[] {
    return [...state.players].sort((a, b) => {
      if (a.total < b.total) return -1;
      else if (a.total > b.total) return 1;
      else return 0;
    });
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
          },
        ];
  }

  onEndGame() {
    let winners = this.calculateWinner(this.gameState);
    this.save("winners", JSON.stringify(winners));

    this.openBottomSheet();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomsheetComponent, { closeOnNavigation: true });
  }

  closeBottomSheet(): void {
    this._bottomSheet.dismiss();
  }

  getExtraLabel(): string {
    switch (this.gameState.game.extra) {
      case ExtraScore.PREVIOUSTOTAL:
        return "Prev.";

      case ExtraScore.NULLEN:
        return "Nullen";

      case ExtraScore.PHASE:
        return "Phase";

      default:
        return "Prev.";
    }
  }

  addPhase(id: number) {
    if (this.gameState.game.type === EGame.PHASE10) {
      let player = this.gameState.players.find((p) => p.id === id);

      if (player) {
        player.extra = player.extra + 1;
      }
    }
  }
}
