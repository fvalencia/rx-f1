import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import {
  Driver,
  DriversResponse,
  DriversStandingResponse,
  DriverStanding,
  Page,
  Pagination,
  Race,
  RacesResponse,
  Result,
  SeasonsResponse,
  WikiPage,
  WikiResponse,
} from '../../model';

@Injectable()
export class SeasonService {
  private url: string = 'https://ergast.com/api/f1';
  private wikiUrl: string = '/wiki';
  private undefinedProfileAsset = '/assets/profile.jpeg';
  private undefinedCircuitAsset = './assets/no-image.jpg';

  constructor(private http: HttpClient) {}

  getSeasons() {
    return this.http
      .get<SeasonsResponse>(`${this.url}/seasons.json`, {
        params: { limit: 100 },
      })
      .pipe(
        map((response) =>
          response.MRData.SeasonTable.Seasons.map(
            (seasonObj) => seasonObj.season
          )
        )
      );
  }

  getDrivers(season: string, pagination: Pagination): Observable<Page<Driver>> {
    return this.http
      .get<DriversResponse>(`${this.url}/${season}/drivers.json`, {
        params: {
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      })
      .pipe(
        map((response) => ({
          total: +response.MRData.total,
          pageIndex: +response.MRData.offset / +response.MRData.limit,
          pageSize: +response.MRData.limit,
          list: response.MRData.DriverTable.Drivers.map((d) => ({
            ...d,
            picure: this.undefinedProfileAsset,
          })),
        })),
        switchMap((page) => {
          return this.getWikiPictures(
            page.list.map((d) => d.givenName + '_' + d.familyName).join('|')
          ).pipe(
            map((pages) => {
              return {
                ...page,
                list: page.list.map((driver) => ({
                  ...driver,
                  picture:
                    this.extractThumnailFromTitle(
                      driver.givenName + ' ' + driver.familyName,
                      pages
                    ) || this.undefinedProfileAsset,
                })),
              };
            }),
            catchError(() =>
              of({
                ...page,
              })
            )
          );
        })
      );
  }

  getRaces(season: string, pagination: Pagination): Observable<Page<Race>> {
    return this.http
      .get<RacesResponse>(`${this.url}/${season}/results/1.json`, {
        params: {
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      })
      .pipe(
        map((response) => ({
          total: +response.MRData.total,
          pageIndex: +response.MRData.offset / +response.MRData.limit,
          pageSize: +response.MRData.limit,
          list: response.MRData.RaceTable.Races.map((race) => ({
            season: race.season,
            round: race.round,
            url: race.url,
            raceName: race.raceName,
            circuitName: race.Circuit.circuitName,
            date: new Date(race.date),
            time: race.time,
            picture: this.undefinedCircuitAsset,
            winner: `${race.Results[0].Driver.givenName} ${race.Results[0].Driver.familyName} - ${race.Results[0].Constructor.name} - ${race.Results[0].Time.time}`,
            qualifyingResults: [],
            results: [],
          })),
        })),
        switchMap((page) => {
          return this.getWikiPictures(
            page.list.map((r) => r.raceName).join('|')
          ).pipe(
            map((pages) => {
              return {
                ...page,
                list: page.list.map((race) => ({
                  ...race,
                  picture:
                    this.extractThumnailFromTitle(race.raceName, pages) ||
                    this.undefinedCircuitAsset,
                })),
              };
            }),
            catchError(() =>
              of({
                ...page,
              })
            )
          );
        })
      );
  }

  getQualifyingResults(season: string, round: string): Observable<Race> {
    return this.http
      .get<RacesResponse>(`${this.url}/${season}/${round}/qualifying.json`)
      .pipe(
        map((response) => {
          const race = response.MRData.RaceTable.Races[0];
          const qualifyingResults = race.QualifyingResults;
          return {
            season: race.season,
            round: race.round,
            url: race.url,
            raceName: race.raceName,
            circuitName: race.Circuit.circuitName,
            date: new Date(race.date),
            time: race.time,
            picture: this.undefinedCircuitAsset,
            winner: '',
            results: [],
            qualifyingResults: qualifyingResults.map((q) => ({
              number: q.number,
              position: q.position,
              driver: q.Driver.givenName + ' ' + q.Driver.givenName,
              constructor: q.Constructor.name,
              Q1: q.Q1,
              Q2: q.Q2,
              Q3: q.Q3,
            })),
          };
        }),
        switchMap((race) => {
          return this.getWikiPictures(race.raceName).pipe(
            map((pages) => {
              return {
                ...race,
                picture:
                  this.extractThumnailFromTitle(race.raceName, pages) ||
                  this.undefinedCircuitAsset,
              };
            }),
            catchError(() =>
              of({
                ...race,
              })
            )
          );
        })
      );
  }

  getDriversStanding(
    season: string,
    round: string
  ): Observable<DriverStanding[]> {
    return this.http
      .get<DriversStandingResponse>(
        `${this.url}/${season}/${round}/driverStandings.json`
      )
      .pipe(
        map((driversResponse) =>
          driversResponse.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
            (d) => ({
              position: d.position,
              points: d.points,
              wins: d.wins,
              driver: d.Driver.givenName + ' ' + d.Driver.familyName,
              picture: this.undefinedProfileAsset,
              constructor: d.Constructors[0].name,
            })
          )
        ),
        switchMap((drivers) => {
          return this.getWikiPictures(
            drivers.map((d) => d.driver).join('|')
          ).pipe(
            map((pages) => {
              return drivers.map((d) => ({
                ...d,
                picture:
                  this.extractThumnailFromTitle(d.driver, pages) ||
                  this.undefinedProfileAsset,
              }));
            }),
            catchError(() => of([...drivers]))
          );
        })
      );
  }

  getRaceResults(season: string, round: string): Observable<Result[]> {
    return this.http
      .get<RacesResponse>(`${this.url}/${season}/${round}/results.json`)
      .pipe(
        map((raceResponse) =>
          raceResponse.MRData.RaceTable.Races[0].Results.map((r) => ({
            position: r.position,
            no: r.number,
            driver: r.Driver.givenName + ' ' + r.Driver.familyName,
            constructor: r.Constructor.name,
            laps: r.laps,
            grid: r.grid,
            time: r.Time ? r.Time.time : '',
            status: r.status,
            points: r.points,
          }))
        )
      );
  }

  private getWikiPictures<T>(titles: string) {
    return this.http
      .get<WikiResponse>(this.wikiUrl, {
        params: {
          action: 'query',
          titles,
          prop: 'pageimages',
          format: 'json',
          pithumbsize: 300,
          origin: '*',
        },
      })
      .pipe(
        map((response) => {
          const pageObj = response.query.pages;
          const pages = Object.keys(response.query.pages).map(
            (key) => pageObj[key]
          );
          return pages;
        })
      );
  }

  private extractThumnailFromTitle(title: string, pages: WikiPage[]) {
    const page = pages.find((p) => p.title === title);
    if (page && page.thumbnail && page.thumbnail.source) {
      return page.thumbnail.source;
    }
    return null;
  }
}
