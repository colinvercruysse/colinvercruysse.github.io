import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { GameState, Player } from 'src/app/data/interfaces';

@Component({
  selector: 'app-bottomsheet',
  templateUrl: './bottomsheet.component.html',
  styleUrls: ['./bottomsheet.component.scss']
})
export class BottomsheetComponent implements OnInit{
  state: GameState | undefined;
  winner: Player | undefined;

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomsheetComponent>) {}

  ngOnInit(): void {
    this.state = JSON.parse(localStorage.getItem('currentState')?? '');
    this.winner = JSON.parse(localStorage.getItem('winner') ?? '');
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
