import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { SeasonService } from '@core/services';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-season-select',
  templateUrl: './season-select.component.html',
  styleUrls: ['./season-select.component.scss'],
})
export class SeasonSelectComponent implements OnInit, OnDestroy {
  seasonList: string[];
  seasonControl = new FormControl('');
  subscription = new Subscription();

  @Output() change = new EventEmitter<string>();
  @Input() initialSeason: string = '';

  constructor(private seasonService: SeasonService) {}

  ngOnInit(): void {
    this.subscription = this.seasonControl.valueChanges.subscribe((changes) => {
      if (changes) {
        this.change.emit(changes);
      }
    });

    this.seasonService
      .getSeasons()
      .pipe(map((seasons) => seasons.sort((a, b) => +b - +a)))
      .subscribe((seasonList) => {
        this.seasonList = seasonList;
        if (this.initialSeason) {
          this.seasonControl.setValue(this.initialSeason);
        } else {
          this.seasonControl.setValue(this.seasonList[1]);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
