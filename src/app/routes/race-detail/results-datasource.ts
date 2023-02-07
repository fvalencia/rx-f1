import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Result } from '@core/model';
import { SeasonService } from '@core/services';
import { BaseDataSource } from '@core/classes';

interface Stats {
  [status: string]: number;
}

export class ResultsDataSource extends BaseDataSource<Result> {
  public statsSubject = new BehaviorSubject<Stats>({
    Finished: 0,
    Accident: 0,
    '+1 Lap': 0,
  });
  public stats$ = this.statsSubject.asObservable();

  constructor(private seasonService: SeasonService) {
    super();
  }

  loadResults(season: string, round: string) {
    this.loadingSubject.next(true);
    this.seasonService
      .getRaceResults(season, round)
      .pipe(
        catchError(() => of([] as Result[])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((results) => {
        this.dataSubject.next(results);
        this.statsSubject.next(this.calculateStats(results));
      });
  }

  private calculateStats(results: Result[]): Stats {
    return results.reduce(
      (acc, current) => {
        if (acc.hasOwnProperty(current.status)) {
          return {
            ...acc,
            [current.status]: acc[current.status] + 1,
          };
        }

        return acc;
      },
      {
        Finished: 0,
        Accident: 0,
        '+1 Lap': 0,
      } as Stats
    );
  }
}
