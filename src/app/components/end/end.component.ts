import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ExtraScore, GameState, Player } from "src/app/data/interfaces";
import {
  bounceInUpOnEnterAnimation,
  rubberBandAnimation,
} from "angular-animations";
import { GameStateService } from "src/app/services/game.service";

@Component({
  selector: "app-end",
  templateUrl: "./end.component.html",
  styleUrls: ["./end.component.scss"],
  animations: [
    bounceInUpOnEnterAnimation({ anchor: "enter1" }),
    bounceInUpOnEnterAnimation({ anchor: "enter2", delay: 100 }),
    rubberBandAnimation(),
  ],
})
export class EndComponent implements OnInit {
  public gameState: GameState;
  winners: Player[] = [];
  displayedColumns: string[] = ["position", "name", "extra", "total"];
  animationState = false;
  animationWithState = false;
  hueBtnState = false;

  constructor(private router: Router, private gameStateService: GameStateService) {
    let s: GameState;

    s = JSON.parse(localStorage.getItem("currentState") ?? "");

    // Order the state players on position
    s.players.sort(this.comparePositions);

    this.gameState = s;
  }

  ngOnInit(): void {
    this.winners = JSON.parse(localStorage.getItem("winners") ?? "");
  }

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
      this.animationWithState = !this.animationWithState;
    }, 1);
  }

  navigateToHomescreen() {
    this.router.navigate(["/home"]);
  }

  navigateToGame() {
    this.router.navigate(["/game"]);
  }

  getNgStyle(player: Player): object {
    if (player.position === 1) {
      return {
        "max-width": "60px",
        "background-color": "#77dd77",
      };
    }

    let worstPosition = Math.max(
      ...this.gameState.players.map((p) => p.position)
    );

    if (player.position === worstPosition) {
      return {
        "max-width": "60px",
        "background-color": "#ff6961",
      };
    }

    // If player is not winner/loser, return orange background
    return {
      "max-width": "60px",
      "background-color": "#FAC898",
    };
  }

  comparePositions(a: Player, b: Player) {
    if (a.position < b.position) {
      return -1;
    }
    if (a.position > b.position) {
      return 1;
    }
    return 0;
  }

  onReturnToGame() {
    this.router.navigate(["/game"]);
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
}
