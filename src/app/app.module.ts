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
import { EndComponent } from "./components/end/end.component";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { HalloffameComponent } from './components/halloffame/halloffame.component';
import { MostwinsComponent } from './components/halloffame/mostwins/mostwins.component';

@NgModule({
  declarations: [
    AppComponent,
    GamegridComponent,
    HomeComponent,
    RadiobuttonComponent,
    EndComponent,
    HalloffameComponent,
    MostwinsComponent,
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
