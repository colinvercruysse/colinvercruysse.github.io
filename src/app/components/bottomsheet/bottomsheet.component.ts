import { Component, OnInit } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { links } from "src/app/data/giflinks";
import { GameState, Player } from "src/app/data/interfaces";

@Component({
  selector: "app-bottomsheet",
  templateUrl: "./bottomsheet.component.html",
  styleUrls: ["./bottomsheet.component.scss"],
})
export class BottomsheetComponent implements OnInit {
  state: GameState | undefined;
  winners: Player[] = [];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomsheetComponent>
  ) {}

  ngOnInit(): void {
    this.state = JSON.parse(localStorage.getItem("currentState") ?? "");
    this.winners = JSON.parse(localStorage.getItem("winners") ?? "");
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getRandomWinnerGif(): string {
    if (this.winners.length === 1) {
      let winner = this.winners[0];

      switch (winner?.name) {
        case "Megan":
          return "https://i.kym-cdn.com/photos/images/newsfeed/000/820/721/d8b.jpg";
          break;

        case "Colin":
          return "https://i.imgflip.com/2p4sv0.jpg?a465184";
          break;

        case "Chadia":
          return "https://imgflip.com/s/meme/Oprah-You-Get-A.jpg";
          break;
      }
    }

    return links[Math.floor(Math.random() * links.length)];
  }
}
