import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamegridComponent } from './components/gamegrid/gamegrid.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'game', component: GamegridComponent},
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch:'full'},
  { path: '**', redirectTo:'/home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
