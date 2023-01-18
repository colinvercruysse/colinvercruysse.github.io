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

  gameInMemory: boolean = false;

  constructor(private router: Router) {
    let state = localStorage.getItem('currentState');

    if (state) this.gameInMemory = true;
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

  calculateNumberOfRounds(NumberOfPlayers: number, game: EGame): number {
    switch(game) {
      case EGame.CHINEESPOEPEN:
        return (Math.floor(52/NumberOfPlayers) * 2);

     case EGame.NULLENSPEL:
        return (Math.floor(52/NumberOfPlayers) * 2);
        
     default:
        return Number.MAX_SAFE_INTEGER;
    }
  }

  startGame() {
    let i = 0;
    let players: Player[] = [];
    this.names.forEach(n => {
      players.push({
        id: i,
        name: n,
        currentRound: 1,
        position: i,
        score: 0,
        total: 0,
        nullen: 0,
      });

      i++;
    });

    this.selectedGame.maxRounds = this.calculateNumberOfRounds(players.length, this.selectedGame.type);

    this.gameState = {
      players: players,
      game: this.selectedGame,
      currentPlayer: players[0].id
    }

    localStorage.setItem('currentState', JSON.stringify(this.gameState));

    this.router.navigate(['/game'])
  }

  returnToGame() {
    this.router.navigate(['/game'])
  }

  randomizePlayersList() {
    this.names.sort((a,b) => 0.5 - Math.random());
  }
}
