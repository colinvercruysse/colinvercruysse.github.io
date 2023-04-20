import { Component, OnDestroy, OnInit } from "@angular/core";
import { IGame, GameState, Player, ExtraScore } from "src/app/data/interfaces";
import { Router } from "@angular/router";
import { GameFactory } from "src/app/games/GameFactory";
import { GameStateService } from "src/app/services/game.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedGame: IGame | undefined;
  games: IGame[] = [];
  names: string[] = [];
  gameState: GameState | undefined;
  gameInMemory: boolean = false;
  maxScore: boolean = true;

  destroy$ = new Subject<boolean>();

  gameFactory: GameFactory = new GameFactory();

  knownPlayers: Player[] = [];

  constructor(private router: Router, private db: GameStateService) {
    let state = localStorage.getItem("currentState");

    if (state) this.gameInMemory = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {
    this.games = this.gameFactory.getGames();
    this.selectedGame = this.games[0];

    // Fill the players dropdown menu
    this.db.getAllPlayers().valueChanges().pipe(takeUntil(this.destroy$)).subscribe(
      players => {
        this.knownPlayers = [...new Set(players)]
      }
    )
  }

  addName(event: any) {
    if (event.target && event.target.value) {
      this.names.push(this.capitalizeFirstLetter(event.target.value.trim()));

      // If the player is not a known name, add it to the database with some default values
      if (!this.knownPlayers.find(p => p.name === this.capitalizeFirstLetter(event.target.value.trim()))) {
        this.db.addPlayer({
          id: 0,
          currentRound: 0,
          extra: ExtraScore.PREVIOUSTOTAL,
          name: this.capitalizeFirstLetter(event.target.value.trim()),
          position: 0,
          roundFilled: false,
          score: 0,
          total: 0
        });
      }

      event.target.value = "";
    }
  }

  deleteName(name: string) {
    this.names = this.names.filter((n) => n !== name);
  }

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

    if (this.selectedGame?.name === "Phase 10") {
      players.forEach((p) => (p.extra = 1));
    }

    this.selectedGame!.maxRounds = this.selectedGame!.calculateNumberOfRounds(players.length);

    this.gameState = {
      players: players,
      game: this.selectedGame!,
      currentPlayer: players[0].id,
      date: new Date()
    };

    localStorage.setItem("currentState", JSON.stringify(this.gameState));

    this.router.navigate(["/game"]);
  }

  returnToGame() {
    this.router.navigate(["/game"]);
  }

  goToHallOfFame(): void {
    this.router.navigate(["/halloffame"]);
  }

  randomizePlayersList() {
    this.names.sort((a, b) => 0.5 - Math.random());
  }

  capitalizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

