import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IGame } from 'src/app/data/interfaces';
import { GameFactory } from 'src/app/games/GameFactory';
import { GameStateService } from 'src/app/services/game.service';

@Component({
  selector: 'app-halloffame',
  templateUrl: './halloffame.component.html',
  styleUrls: ['./halloffame.component.scss']
})
export class HalloffameComponent implements OnInit {
  gameFactory: GameFactory = new GameFactory();
  games: IGame[] = [];
  selectedGame: IGame | undefined;

  selectedGame$: Observable<IGame | undefined> = of(undefined);

  constructor(private router: Router, private db: GameStateService) {

  }

  ngOnInit(): void {
    this.games = this.gameFactory.getGames();
    this.selectedGame = this.games[0];

    this.selectedGame$.subscribe(x => console.log(x?.name))
  }

  navigateToHomescreen() {
    this.router.navigate(["/home"]);
  }

  getPlayedGames(game: IGame): IGame[] {
    this.db.getAll().valueChanges().subscribe(items => {
      return items.filter(state => state.game.name === game.name);
    });

    return [];
  }
}
