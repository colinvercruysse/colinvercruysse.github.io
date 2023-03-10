import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import {
  MatRadioModule,
  MAT_RADIO_DEFAULT_OPTIONS,
} from "@angular/material/radio";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GamegridComponent } from "./components/gamegrid/gamegrid.component";
import { HomeComponent } from "./components/home/home.component";
import { RadiobuttonComponent } from "./components/radiobutton/radiobutton.component";
import { ToggleComponent } from "./components/toggle/toggle.component";
import { EndComponent } from "./components/end/end.component";

@NgModule({
  declarations: [
    AppComponent,
    GamegridComponent,
    HomeComponent,
    RadiobuttonComponent,
    ToggleComponent,
    EndComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    MatRadioModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatBottomSheetModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
