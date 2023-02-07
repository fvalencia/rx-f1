import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SeasonSelectComponent } from '@core/components/season-select/season-select.component';
import { SeasonService } from '@core/services';
import { combineLatest, Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';

import { RaceDataSource } from './race-datasource';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
})
export class RaceComponent implements OnInit {
  dataSource: RaceDataSource;
  displayedColumns = [
    'round',
    'raceName',
    'raceDate',
    'raceTime',
    'circuit',
    'picture',
    'result',
    'detail',
  ];
  unsubscribe$ = new Subject<void>();
  season = '2022';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(SeasonSelectComponent) seasonSelect: SeasonSelectComponent;

  constructor(
    private seasonService: SeasonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource = new RaceDataSource(this.seasonService);
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ season }) => {
        if (season) {
          this.season = season;
        } else {
          this.router.navigate(['/races', this.season]);
        }
      });
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
        tap(() => (seasonChange = true)),
        tap((season) => this.router.navigate(['/races', season]))
      ),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([page, season]) => {
        this.dataSource.loadRaces(
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
