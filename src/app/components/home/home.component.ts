import { Component } from '@angular/core';
import { EGame, Game, GameState, Player } from 'src/app/data/interfaces';
import { config } from 'src/app/data/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedGame: Game  = config.games[0];
  games = config.games;

  names: string[] = [];

  gameState: GameState | undefined;

  constructor(private router: Router) {

  }

  addName(event: any) {
    if (event.target && event.target.value) {
      this.names.push(event.target.value);
      event.target.value ="";
    }
  }

  deleteName(name: string) {
    this.names = this.names.filter(n => n !== name);
  }

  startGame() {
    let i = 0;
    let players: Player[] = [];
    this.names.forEach(n => {
      players.push({
        id: i,
        name: n,
        currentRound: 0,
        position: i,
        score: 0,
        total: 0,
        nullen: 0,
      });

      i++;
    });


    this.gameState = {
      players: players,
      game: this.selectedGame,
      currentPlayer: players[0].id
    }

    localStorage.setItem('currentState', JSON.stringify(this.gameState));

    this.router.navigate(['/game'])
  }
}
