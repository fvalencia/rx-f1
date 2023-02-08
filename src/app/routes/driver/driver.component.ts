import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SeasonSelectComponent } from '@core/components/season-select/season-select.component';
import { SeasonService } from '@core/services';
import { combineLatest, Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';

import { DriversDataSource } from './driver-datasource';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements AfterViewInit, OnDestroy {
  dataSource: DriversDataSource;
  displayedColumns = [
    'picture',
    'code',
    'givenName',
    'familyName',
    'nationality',
    'dateOfBirth',
    'url',
  ];
  unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SeasonSelectComponent) seasonSelect: SeasonSelectComponent;

  constructor(private seasonService: SeasonService) {
    this.dataSource = new DriversDataSource(this.seasonService);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    let seasonChange = false;
    combineLatest([
      this.paginator.page.pipe(
        startWith({
          pageIndex: 0,
          pageSize: 10,
          length: 0,
          previousPageIndex: 0,
        })
      ),
      this.seasonSelect.change.pipe(
        filter((season) => !!season),
        tap(() => (seasonChange = true))
      ),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([page, season]) => {
        this.dataSource.loadDrivers(
          season,
          seasonChange ? 0 : page.pageIndex,
          page.pageSize
        );
        seasonChange = false;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
