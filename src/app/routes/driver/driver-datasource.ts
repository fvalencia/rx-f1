import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Driver } from '@core/model';
import { SeasonService } from '@core/services';
import { BaseDataSource } from '@core/classes';

export class DriversDataSource extends BaseDataSource<Driver> {
  constructor(private seasonService: SeasonService) {
    super();
  }

  loadDrivers(season: string, pageIndex = 0, pageSize = 10) {
    this.loadingSubject.next(true);
    this.seasonService
      .getDrivers(season, { pageIndex, pageSize })
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
