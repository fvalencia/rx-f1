import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DriverComponent } from './routes/driver/driver.component';
import { AppMaterialModule } from './app-material.module';
import { CoreModule } from './core/core.module';
import { RaceComponent } from './routes/race/race.component';
import { RaceDetailComponent } from './routes/race-detail/race-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DriverComponent,
    RaceComponent,
    RaceDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
