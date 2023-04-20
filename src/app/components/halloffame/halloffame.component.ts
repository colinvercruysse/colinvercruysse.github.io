import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, } from 'rxjs';
import { IGame } from 'src/app/data/interfaces';
import { GameFactory } from 'src/app/games/GameFactory';
import { GameStateService } from 'src/app/services/game.service';

@Component({
  selector: 'app-halloffame',
  templateUrl: './halloffame.component.html',
  styleUrls: ['./halloffame.component.scss']
})
export class HalloffameComponent implements OnInit, OnDestroy {
  gameFactory: GameFactory = new GameFactory();
  games: IGame[] = [];
  selectedGame: IGame | undefined;

  destroy$ = new Subject();

  constructor(private router: Router, private db: GameStateService) {

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {
    this.games = this.gameFactory.getGames();
    this.selectedGame = this.games[0];
  }

  navigateToHomescreen() {
    this.router.navigate(["/home"]);
  }
}
