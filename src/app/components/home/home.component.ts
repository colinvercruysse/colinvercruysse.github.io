import { Component, OnInit } from "@angular/core";
import { EGame, IGame, GameState, Player } from "src/app/data/interfaces";
import { Router } from "@angular/router";
import { GameFactory } from "src/app/games/GameFactory";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  selectedGame: IGame | undefined;
  games: IGame[] = [];

  names: string[] = [];

  gameState: GameState | undefined;

  gameInMemory: boolean = false;

  maxScore: boolean = true;

  gameFactory: GameFactory = new GameFactory();

  constructor(private router: Router) {
    let state = localStorage.getItem("currentState");

    if (state) this.gameInMemory = true;
  }
  ngOnInit(): void {
    this.games = this.gameFactory.getGames();
    this.selectedGame = this.games[0];
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

  // calculateNumberOfRounds(NumberOfPlayers: number, game: EGame): number {
  //   switch (game) {
  //     case EGame.CHINEESPOEPEN:
  //       return Math.floor(52 / NumberOfPlayers) * 2 + 1;

  //     case EGame.NULLENSPEL:
  //       return Math.floor(52 / NumberOfPlayers) * 2 + 1;

  //     default:
  //       return Number.MAX_SAFE_INTEGER;
  //   }
  // }

  startGame() {
    let i = 0;
    let players: Player[] = [];
    this.names.forEach((n) => {
      players.push({
        id: i,
        name: n,
        currentRound: 1,
        position: 1,
        score: 0,
        total: 0,
        extra: 0,
        roundFilled: false,
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

    // this.selectedGame!.maxRounds = this.calculateNumberOfRounds(
    //   players.length,
    //   this.selectedGame ? this.selectedGame.type : EGame.NONE_MAX_SCORE
    // );

    this.selectedGame!.maxRounds = this.selectedGame!.calculateNumberOfRounds(players.length);

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
