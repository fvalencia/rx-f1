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

// export class DriversDataSource implements DataSource<Driver> {
//   private driverSubject = new BehaviorSubject<Driver[]>([]);
//   private loadingSubject = new BehaviorSubject<boolean>(false);

//   public loading$ = this.loadingSubject.asObservable();
//   public paginator: MatPaginator;

//   constructor(private seasonService: SeasonService) {}

//   connect(): Observable<Driver[]> {
//     return this.driverSubject.asObservable();
//   }

//   disconnect(): void {
//     this.driverSubject.complete();
//     this.loadingSubject.complete();
//   }

//   loadDrivers(season: string, pageIndex = 0, pageSize = 10) {
//     this.loadingSubject.next(true);
//     this.seasonService
//       .getDrivers(season, { pageIndex, pageSize })
//       .pipe(
//         catchError(() =>
//           of({ list: [], pageIndex: 0, pageSize: 10, total: 0 })
//         ),
//         finalize(() => this.loadingSubject.next(false))
//       )
//       .subscribe((page) => {
//         this.paginator.length = page.total;
//         this.paginator.pageIndex = page.pageIndex;
//         this.paginator.pageSize = page.pageSize;
//         this.driverSubject.next(page.list);
//       });
//   }
// }
