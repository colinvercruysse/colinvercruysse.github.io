import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GameState, IGame } from 'src/app/data/interfaces';
import { GameStateService } from 'src/app/services/game.service';

@Component({
  selector: 'app-mostwins',
  templateUrl: './mostwins.component.html',
  styleUrls: ['./mostwins.component.scss']
})
export class MostwinsComponent implements OnInit, OnDestroy {
  @Input()
  maxNumberOfPlayers: number = 3;
  states: GameState[] | undefined;
  destroy$ = new Subject<boolean>();

  data: { position: number, name: string, total: number }[] = [];
  displayedColumns: string[] = ["position", "name", "total"];

  constructor(private gameStateService: GameStateService) {
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

      this.states = items.filter(state => state.game.name === game.name);
      this.data = this.getData(this.states);
    });
  }

  getData(states: GameState[]): { position: number, name: string, total: number }[] {
    var res: { position: number; name: string; total: number; }[] = [];

    // loop over all states
    for (let i = 0; i < states.length; i++) {
      // Get all winners of every state
      let winners = states[i].players.filter(p => p.position === 1);

      // Check if the winner already is in res, if not, create new object
      for (let j = 0; j < winners.length; j++) {
        let resWinner = res.find(x => x.name === winners[j].name);

        if (!resWinner) {
          // If the winner is not known in res, make a new object
          res.push({ position: Number.MIN_SAFE_INTEGER, name: winners[j].name, total: 1 })
        } else {
          // If the winner is already known in res, update this object
          resWinner.total = resWinner.total + 1;
        }
      }
    }

    // If the res object is filled, it needs to be odered by most wins
    res.sort(this.compare);

    // Update position mark
    for (let i = 0; i < res.length; i++) {
      if (i === 0) {
        res[i].position = 1;
      } else {
        if (res[i].total === res[i - 1].total) {
          res[i].position = res[i - 1].position;
        } else {
          res[i].position = res[i - 1].position + 1;
        }
      }
    }

    // Only show the max number of players
    return res.slice(0, this.maxNumberOfPlayers - 1);
  }

  getNgClass(position: number): string {
    let base = "small";

    if (position === 1) {
      return base + " first";
    }

    if (position === 2) {
      return base + " second";
    }

    if (position === 3) {
      return base + " third";
    }

    return base + " mid";
  }

  private compare(a: any, b: any): number {
    if (a.total < b.total) {
      return 1;
    }
    if (a.total > b.total) {
      return -1;
    }
    return 0;
  }


}
