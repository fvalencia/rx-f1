import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Race } from '@core/model';
import { SeasonService } from '@core/services';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { QualifyingDataSource } from './qualifying-datasource';
import { ResultsDataSource } from './results-datasource';
import { DriversStandingDataSource } from './standing-datasource';

@Component({
  selector: 'app-race-detail',
  templateUrl: './race-detail.component.html',
  styleUrls: ['./race-detail.component.scss'],
})
export class RaceDetailComponent implements OnInit, OnDestroy {
  results: ResultsDataSource;
  qualiyingDataSource: QualifyingDataSource;
  driversStandingDataSource: DriversStandingDataSource;
  resultsDisplayedColumns = [
    'position',
    'number',
    'driver',
    'constructor',
    'laps',
    'grid',
    'time',
    'status',
    'points',
  ];
  qualiyingDisplayedColumns = [
    'position',
    'number',
    'driver',
    'constructor',
    'q1',
    'q2',
    'q3',
  ];
  driversStandingDisplayedColumns = [
    'position',
    'picture',
    'driver',
    'constructor',
    'points',
    'wins',
  ];
  race: Race | undefined;
  season: string;
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private seasonService: SeasonService
  ) {
    this.results = new ResultsDataSource(this.seasonService);
    this.qualiyingDataSource = new QualifyingDataSource(this.seasonService);
    this.driversStandingDataSource = new DriversStandingDataSource(
      this.seasonService
    );
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ season, round }) => {
        this.season = season;
        this.results.loadResults(season, round);
        this.qualiyingDataSource.loadQualifyingPerRace(season, round);
        this.driversStandingDataSource.loadDriversStanding(season, round);
      });

    this.qualiyingDataSource.race$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((race) => !!race && !!race.raceName)
      )
      .subscribe((race) => (this.race = race));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
