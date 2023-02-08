import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { createMock, Mock } from '@testing-library/angular/jest-utils';
import { of } from 'rxjs';

import { SeasonService } from './season.service';

describe('SeasonService', () => {
  let service: SeasonService;
  let http: Mock<HttpClient>;
  const apiUrl = 'https://ergast.com/api/f1';
  const wikiUrl = 'https://en.wikipedia.org/w/api.php';

  beforeEach(() => {
    http = createMock(HttpClient);
    TestBed.configureTestingModule({
      providers: [
        SeasonService,
        {
          provide: HttpClient,
          useValue: http,
        },
      ],
    });
    service = TestBed.inject(SeasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getSeasons', (done) => {
    jest.spyOn(http, 'get').mockImplementation(() =>
      of({
        MRData: {
          SeasonTable: {
            Seasons: [
              { season: '2022' },
              { season: '2021' },
              { season: '2020' },
            ],
          },
        },
      })
    );

    service.getSeasons().subscribe((data) => {
      expect(data).toEqual(['2022', '2021', '2020']);
      done();
    });
    expect(http.get).toBeCalledWith(`${apiUrl}/seasons.json`, {
      params: { limit: 100 },
    });
  });

  it('should getDrivers', (done) => {
    const season = '2022';
    const pagination = { pageIndex: 0, pageSize: 10 };

    jest
      .spyOn(http, 'get')
      .mockImplementationOnce(() =>
        of({
          MRData: {
            total: '100',
            offset: '0',
            limit: '10',
            DriverTable: {
              Drivers: [
                {
                  driverId: 'alguersuari',
                  code: 'ALG',
                  url: 'http://en.wikipedia.org/wiki/Jaime_Alguersuari',
                  givenName: 'Jaime',
                  familyName: 'Alguersuari',
                  dateOfBirth: '1990-03-23',
                  nationality: 'Spanish',
                },
                {
                  driverId: 'alonso',
                  permanentNumber: '14',
                  code: 'ALO',
                  url: 'http://en.wikipedia.org/wiki/Fernando_Alonso',
                  givenName: 'Fernando',
                  familyName: 'Alonso',
                  dateOfBirth: '1981-07-29',
                  nationality: 'Spanish',
                },
              ],
            },
          },
        })
      )
      .mockImplementationOnce(() =>
        of({
          query: {
            pages: {
              '12345': {
                title: 'Fernando Alonso',
                thumbnail: {
                  source: 'el_fercho.jpg',
                },
              },
              '67891': {
                title: 'Jaime Alguersuari',
                thumbnail: {
                  source: 'el_jaime.jpg',
                },
              },
            },
          },
        })
      );

    service.getDrivers(season, pagination).subscribe((data) => {
      expect(data).toEqual({
        total: 100,
        pageIndex: 0,
        pageSize: 10,
        list: [
          {
            code: 'ALG',
            dateOfBirth: '1990-03-23',
            driverId: 'alguersuari',
            familyName: 'Alguersuari',
            givenName: 'Jaime',
            nationality: 'Spanish',
            picture: 'el_jaime.jpg',
            url: 'http://en.wikipedia.org/wiki/Jaime_Alguersuari',
          },
          {
            code: 'ALO',
            dateOfBirth: '1981-07-29',
            driverId: 'alonso',
            familyName: 'Alonso',
            givenName: 'Fernando',
            nationality: 'Spanish',
            permanentNumber: '14',
            picture: 'el_fercho.jpg',
            url: 'http://en.wikipedia.org/wiki/Fernando_Alonso',
          },
        ],
      });
      done();
    });

    // Inital http call to drivers api
    expect(http.get).toBeCalledWith(`${apiUrl}/${season}/drivers.json`, {
      params: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      },
    });
    // Call to wiki to get images
    expect(http.get).toBeCalledWith(wikiUrl, {
      params: {
        action: 'query',
        titles: 'Jaime_Alguersuari|Fernando_Alonso',
        prop: 'pageimages',
        format: 'json',
        pithumbsize: 300,
        origin: '*',
      },
    });
  });
});
