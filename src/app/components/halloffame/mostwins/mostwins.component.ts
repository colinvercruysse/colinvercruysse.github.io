import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameStateService } from 'src/app/services/game.service';

@Component({
  selector: 'app-mostwins',
  templateUrl: './mostwins.component.html',
  styleUrls: ['./mostwins.component.scss']
})
export class MostwinsComponent implements OnInit, OnDestroy {

  constructor(private gameStateService: GameStateService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.gameStateService.getSelectedGame().subscribe(game => {
      console.log(game?.name);
    })
  }


}
