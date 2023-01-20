import { Component } from "@angular/core";
import { EGame, Game, GameState, Player } from "src/app/data/interfaces";
import { config } from "src/app/data/config";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  selectedGame: Game | undefined = config.games[0];
  games = config.games;

  names: string[] = [];

  gameState: GameState | undefined;

  gameInMemory: boolean = false;

  maxScore: boolean = true;

  constructor(private router: Router) {
    let state = localStorage.getItem("currentState");

    if (state) this.gameInMemory = true;
  }

  addName(event: any) {
    if (event.target && event.target.value) {
      this.names.push(event.target.value);
      event.target.value = "";
    }
  }

  deleteName(name: string) {
    this.names = this.names.filter((n) => n !== name);
  }

  calculateNumberOfRounds(NumberOfPlayers: number, game: EGame): number {
    switch (game) {
      case EGame.CHINEESPOEPEN:
        return Math.floor(52 / NumberOfPlayers) * 2;

      case EGame.NULLENSPEL:
        return Math.floor(52 / NumberOfPlayers) * 2;

      default:
        return Number.MAX_SAFE_INTEGER;
    }
  }

  startGame() {
    let i = 0;
    let players: Player[] = [];
    this.names.forEach((n) => {
      players.push({
        id: i,
        name: n,
        currentRound: 1,
        position: i,
        score: 0,
        total: 0,
        extra: 0,
      });

      i++;
    });

    if (this.selectedGame === undefined || this.selectedGame === null) {
      this.selectedGame = this.games.find(
        (g) => g.type === EGame.NONE_MAX_SCORE
      );
    }

    if (this.selectedGame?.type === EGame.PHASE10) {
      players.forEach((p) => (p.extra = 1));
    }

    this.selectedGame!.maxRounds = this.calculateNumberOfRounds(
      players.length,
      this.selectedGame ? this.selectedGame.type : EGame.NONE_MAX_SCORE
    );

    this.gameState = {
      players: players,
      game: this.selectedGame!,
      currentPlayer: players[0].id,
    };

    if (this.gameState.game.type === EGame.NONE_MAX_SCORE) {
      if (this.maxScore) {
        this.gameState.game.type = EGame.NONE_MAX_SCORE;
      } else {
        this.gameState.game.type = EGame.NONE_MIN_SCORE;
      }
    }

    localStorage.setItem("currentState", JSON.stringify(this.gameState));

    this.router.navigate(["/game"]);
  }

  returnToGame() {
    this.router.navigate(["/game"]);
  }

  randomizePlayersList() {
    this.names.sort((a, b) => 0.5 - Math.random());
  }

  onToggle(value: any): void {
    if (value) {
      this.maxScore = false;
    } else {
      this.maxScore = true;
    }
  }
}
