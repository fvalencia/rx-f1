import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SeasonService } from '@core/services';
import { createMock, Mock } from '@testing-library/angular/jest-utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SeasonSelectComponentStub } from '@core/components';
import { of, throwError } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';
import { DriverComponent } from './driver.component';

describe('DriverComponent', () => {
  let loader: HarnessLoader;
  let fixture: ComponentFixture<DriverComponent>;
  let seasonService: Mock<SeasonService>;

  beforeEach(async () => {
    seasonService = createMock(SeasonService);
    await TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
      ],
      providers: [
        {
          provide: SeasonService,
          useValue: seasonService,
        },
      ],
      declarations: [DriverComponent, SeasonSelectComponentStub],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should render component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should unsubscribe onDestroy', () => {
    jest.spyOn(fixture.componentInstance.unsubscribe$, 'next');
    jest.spyOn(fixture.componentInstance.unsubscribe$, 'complete');

    fixture.componentInstance.ngOnDestroy();
    fixture.detectChanges;

    expect(fixture.componentInstance.unsubscribe$.next).toHaveBeenCalled();
    expect(fixture.componentInstance.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should loadDrivers for the default page', async () => {
    jest
      .spyOn(fixture.componentInstance.dataSource, 'loadDrivers')
      .mockImplementation(() => {});
    fixture.componentInstance.seasonSelect.change.emit('2022');

    expect(
      fixture.componentInstance.dataSource.loadDrivers
    ).toHaveBeenCalledWith('2022', 0, 10);
  });

  it('should trigger loadDrivers for the next page', async () => {
    jest
      .spyOn(fixture.componentInstance.dataSource, 'loadDrivers')
      .mockImplementation(() => {});
    fixture.componentInstance.seasonSelect.change.emit('2022');
    fixture.detectChanges();

    const paginator = await loader.getHarness(MatPaginatorHarness);
    fixture.componentInstance.paginator.length = 100;
    await paginator.goToNextPage();

    expect(
      fixture.componentInstance.dataSource.loadDrivers
    ).toHaveBeenLastCalledWith('2022', 1, 10);
  });

  it('should loadDrivers on page size change', async () => {
    jest
      .spyOn(fixture.componentInstance.dataSource, 'loadDrivers')
      .mockImplementation(() => {});
    fixture.componentInstance.seasonSelect.change.emit('2022');

    const paginator = await loader.getHarness(MatPaginatorHarness);
    fixture.componentInstance.paginator.length = 100;
    await paginator.setPageSize(15);

    expect(
      fixture.componentInstance.dataSource.loadDrivers
    ).toHaveBeenLastCalledWith('2022', 0, 15);
  });

  it('should go to first page on season change', async () => {
    jest
      .spyOn(fixture.componentInstance.dataSource, 'loadDrivers')
      .mockImplementation(() => {});
    fixture.componentInstance.seasonSelect.change.emit('2022');
    fixture.detectChanges();

    const paginator = await loader.getHarness(MatPaginatorHarness);
    fixture.componentInstance.paginator.length = 100;
    await paginator.goToNextPage();

    fixture.componentInstance.seasonSelect.change.emit('2021');
    fixture.detectChanges();

    expect(
      fixture.componentInstance.dataSource.loadDrivers
    ).toHaveBeenLastCalledWith('2021', 0, 10);
  });

  it('should load drivers from datasource', () => {
    jest.spyOn(seasonService, 'getDrivers').mockImplementation(() =>
      of({
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
        ],
        pageIndex: 1,
        pageSize: 20,
        total: 100,
      })
    );
    jest
      .spyOn(fixture.componentInstance.dataSource.dataSubject, 'next')
      .mockImplementation();
    jest
      .spyOn(fixture.componentInstance.dataSource.loadingSubject, 'next')
      .mockImplementation();
    fixture.componentInstance.seasonSelect.change.emit('2022');
    fixture.detectChanges();

    expect(seasonService.getDrivers).toHaveBeenLastCalledWith('2022', {
      pageIndex: 0,
      pageSize: 10,
    });
    expect(fixture.componentInstance.dataSource.paginator.pageIndex).toEqual(1);
    expect(fixture.componentInstance.dataSource.paginator.pageSize).toEqual(20);
    expect(fixture.componentInstance.dataSource.paginator.length).toEqual(100);
    expect(
      fixture.componentInstance.dataSource.dataSubject.next
    ).toHaveBeenCalledWith([
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
    ]);
    expect(
      fixture.componentInstance.dataSource.loadingSubject.next
    ).toHaveBeenCalledWith(true);
    expect(
      fixture.componentInstance.dataSource.loadingSubject.next
    ).toHaveBeenCalledWith(false);
  });

  it('should return default values on data source error', async () => {
    jest
      .spyOn(seasonService, 'getDrivers')
      .mockReturnValue(throwError(() => 'perdiste papi'));
    jest
      .spyOn(fixture.componentInstance.dataSource.dataSubject, 'next')
      .mockImplementation();
    fixture.componentInstance.seasonSelect.change.emit('2022');
    fixture.detectChanges();

    expect(fixture.componentInstance.dataSource.paginator.pageIndex).toEqual(0);
    expect(fixture.componentInstance.dataSource.paginator.pageSize).toEqual(10);
    expect(fixture.componentInstance.dataSource.paginator.length).toEqual(0);
    expect(
      fixture.componentInstance.dataSource.dataSubject.next
    ).toHaveBeenCalledWith([]);
  });
});
