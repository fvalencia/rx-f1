import { Component, EventEmitter, Output } from '@angular/core';
import { SeasonSelectComponent } from './season-select.component';

@Component({
  selector: 'app-season-select',
  template: '',
  providers: [
    {
      provide: SeasonSelectComponent,
      useClass: SeasonSelectComponentStub,
    },
  ],
})
export class SeasonSelectComponentStub {
  @Output() change = new EventEmitter<string>();
}
