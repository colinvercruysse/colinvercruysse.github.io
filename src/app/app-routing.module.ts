import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EndComponent } from "./components/end/end.component";
import { GamegridComponent } from "./components/gamegrid/gamegrid.component";
import { HomeComponent } from "./components/home/home.component";
import { HalloffameComponent } from "./components/halloffame/halloffame.component";

const routes: Routes = [
  { path: "game", component: GamegridComponent },
  { path: "end", component: EndComponent },
  { path: "halloffame", component: HalloffameComponent },
  { path: "", component: HomeComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
