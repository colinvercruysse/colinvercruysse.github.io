import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GameState, IGame } from 'src/app/data/interfaces';
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

  constructor(private router: Router, private db: GameStateService) {

  }

  ngOnInit(): void {
    this.games = this.gameFactory.getGames();
    this.selectedGame = this.games[0];
  }

  navigateToHomescreen() {
    this.router.navigate(["/home"]);
  }

  onSelectedValueChange(selectedValue: IGame) {
    if (!selectedValue) return;

    this.db.getAll().valueChanges().subscribe(states => {
      //console.log(selectedValue.name, states);
    })
  }

  obs(game: IGame | undefined): Observable<IGame> {
    return of(game!);
  }
}
