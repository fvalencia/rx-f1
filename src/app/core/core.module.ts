import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../app-material.module';
import { LayoutComponent } from './components/layout/layout.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SeasonService } from './services/season/season.service';
import { SeasonSelectComponent } from './components/season-select/season-select.component';

@NgModule({
  declarations: [LayoutComponent, ToolbarComponent, SeasonSelectComponent],
  providers: [SeasonService],
  exports: [LayoutComponent, SeasonSelectComponent],
  imports: [AppMaterialModule, CommonModule],
})
export class CoreModule {}
