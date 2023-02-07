import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { QualifyingResult, Race } from '@core/model';
import { SeasonService } from '@core/services';
import { BaseDataSource } from '@core/classes';

export class QualifyingDataSource extends BaseDataSource<QualifyingResult> {
  public raceSubject = new BehaviorSubject<Race>({} as Race);
  public race$ = this.raceSubject.asObservable();

  constructor(private seasonService: SeasonService) {
    super();
  }

  loadQualifyingPerRace(season: string, round: string) {
    this.loadingSubject.next(true);
    this.seasonService
      .getQualifyingResults(season, round)
      .pipe(
        catchError(() => of({} as Race)),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((race) => {
        this.raceSubject.next(race);
        this.dataSubject.next(race.qualifyingResults);
      });
  }
}
