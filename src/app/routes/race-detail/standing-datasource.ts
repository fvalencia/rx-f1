import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { DriverStanding } from '@core/model';
import { SeasonService } from '@core/services';
import { BaseDataSource } from '@core/classes';

export class DriversStandingDataSource extends BaseDataSource<DriverStanding> {
  constructor(private seasonService: SeasonService) {
    super();
  }

  loadDriversStanding(season: string, round: string) {
    this.loadingSubject.next(true);
    this.seasonService
      .getDriversStanding(season, round)
      .pipe(
        catchError(() => of([] as DriverStanding[])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((driversStanding) => {
        this.dataSubject.next(driversStanding);
      });
  }
}
