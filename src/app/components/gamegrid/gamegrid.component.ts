import { Component, Input, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { EGame, GameState, Player } from 'src/app/data/interfaces';
import { state } from '../../data/dummy';
import { BottomsheetComponent } from '../bottomsheet/bottomsheet.component';

@Component({
  selector: 'app-gamegrid',
  templateUrl: './gamegrid.component.html',
  styleUrls: ['./gamegrid.component.scss']
})
export class GamegridComponent implements OnInit {
  public gameState: GameState;

  displayedColumns: string[] = ['position','name', 'score','nullen', 'total'];

  constructor(private _bottomSheet: MatBottomSheet, private router: Router) { 
    let s: GameState;

    if (localStorage.getItem('currentState')) {
      s = JSON.parse(localStorage.getItem('currentState')?? '');
    } else {
      s = state;
    }
    this.gameState = s;
  }

  ngOnInit(): void {
  }

  saveScore(event: any, index: number) {
    if (event.target && event.target.value) {
      this.addScoreToTotal(index,parseInt(event.target.value))
    }

    event.target.value = '';
  }

  addScoreToTotal(id: number, score: number) {
    let state = this.gameState;

    state.currentPlayer = id;

    let player = state.players.find(p => p.id === id);
    if (player) {
      player.score = score;
      player.total = player.total + score;
    }

    // Add nullen
    if (this.gameState.game.type === EGame.NULLENSPEL) {
      if (player && player.total === 0) {
        player.nullen = player.nullen + 1;
      }
    }

    this.gameState = state;
  }

  onNextRound() {
    let state = this.gameState;

    // Add round to each player
    state.players.forEach(player => player.currentRound = player.currentRound + 1);

    // Add round to game
    state.game.round = state.game.round + 1;

    // Calculate positions
    let orderedPlayers = [...state.players];
    switch(this.gameState.game.type) {
      case EGame.UNO:
        orderedPlayers = this.orderMostPointsFirst(state);
        break;

      case EGame.CHINEESPOEPEN:
        orderedPlayers = this.orderMostPointsFirst(state);
        break;

      case EGame.NULLENSPEL:
        orderedPlayers = this.orderNullenSpel(state);
        break;

      case EGame.PHASE10:
        orderedPlayers = this.orderLeastPointsFirst(state);
        break;

      case EGame.NONE:
        orderedPlayers = this.orderMostPointsFirst(state);
        break;
      
      default:
        orderedPlayers = this.orderMostPointsFirst(state);
        break;
    }


    state.players.forEach(player => player.position = orderedPlayers.findIndex(p => p.name === player.name));

    // Persist
    this.gameState = state;
    this.save('currentState', JSON.stringify(this.gameState));

    if (this.gameState.players[0].currentRound === this.gameState.game.maxRounds) {
      this.onEndGame();
    }
  }

  navigateToHomescreen() {
    this.closeBottomSheet();
    this.router.navigate(['/home'])
  }

  orderMostPointsFirst(state: GameState): Player[] {
    return [...state.players].sort((a, b) => {
      if (a.total > b.total) return -1;
      else if (a.total < b.total) return 1;
      else return 0;
    });
  }

  orderNullenSpel(state: GameState): Player[] {
    return [...state.players].sort((a, b) => {
      if (a.nullen > b.nullen) return -1;
      else if (a.nullen < b.nullen) return 1;
      else return 0;
    })
  }

  orderLeastPointsFirst(state: GameState): Player[] {
    return [...state.players].sort((a, b) => {
      if (a.total < b.total) return -1;
      else if (a.total > b.total) return 1;
      else return 0;
    });
  }

  save(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  calculateWinner(state: GameState): Player {
    let player =  state.players.find(p => p.position === 0);

    return player ? player : {
      id: Number.MAX_SAFE_INTEGER,
      name: 'No winner',
      currentRound: state.players[0].currentRound,
      nullen: Number.MAX_SAFE_INTEGER,
      position: 1,
      score: Number.MAX_SAFE_INTEGER,
      total: Number.MAX_SAFE_INTEGER
    }
  }

  onEndGame() {
    let winner = this.calculateWinner(this.gameState);
    this.save('winner', JSON.stringify(winner));

    this.openBottomSheet();
  }

  openBottomSheet(): void {
      this._bottomSheet.open(BottomsheetComponent, {closeOnNavigation: true});
  }

  closeBottomSheet(): void {
    this._bottomSheet.dismiss();
  }
}
