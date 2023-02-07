import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Race } from '@core/model';
import { SeasonService } from '@core/services';
import { BaseDataSource } from '@core/classes';

export class RaceDataSource extends BaseDataSource<Race> {
  constructor(private seasonService: SeasonService) {
    super();
  }

  loadRaces(season: string, pageIndex = 0, pageSize = 10) {
    this.loadingSubject.next(true);
    this.seasonService
      .getRaces(season, { pageIndex, pageSize })
      .pipe(
        catchError(() =>
          of({ list: [], pageIndex: 0, pageSize: 10, total: 0 })
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((page) => {
        this.paginator.length = page.total;
        this.paginator.pageIndex = page.pageIndex;
        this.paginator.pageSize = page.pageSize;
        this.dataSubject.next(page.list);
      });
  }
}
