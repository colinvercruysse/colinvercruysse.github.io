import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GameState, IGame } from 'src/app/data/interfaces';
import { GameStateService } from 'src/app/services/game.service';

@Component({
  selector: 'app-lastgame',
  templateUrl: './lastgame.component.html',
  styleUrls: ['./lastgame.component.scss']
})
export class LastgameComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();

  state: GameState | undefined = undefined;

  constructor(private router: Router, private gameStateService: GameStateService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {
    this.gameStateService.getSelectedGame().pipe(takeUntil(this.destroy$)).subscribe(game => {
      if (!game) return;
      this.getPlayedGames(game!);
    })
  }

  getPlayedGames(game: IGame): void {
    this.gameStateService.getAll().valueChanges().pipe(takeUntil(this.destroy$)).subscribe(items => {
      if (items.length === 0) return;

      let states = items.filter(state => state.game.name === game.name);
      states.sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })

      this.state = states[0];
    });
  }

  goToGame(): void {
    this.save("currentState", JSON.stringify(this.state));
    this.router.navigate(["/game"]);
  }

  save(key: string, data: string) {
    localStorage.setItem(key, data);
  }
}
