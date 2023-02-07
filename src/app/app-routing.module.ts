import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverComponent } from './routes/driver/driver.component';
import { RaceDetailComponent } from './routes/race-detail/race-detail.component';
import { RaceComponent } from './routes/race/race.component';

const routes: Routes = [
  { path: '', redirectTo: '/drivers', pathMatch: 'full' },
  { path: 'drivers', component: DriverComponent },
  { path: 'races', component: RaceComponent },
  { path: 'races/:season', component: RaceComponent },
  { path: 'races/:season/:round', component: RaceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
