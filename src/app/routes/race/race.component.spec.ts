import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SeasonSelectComponentStub } from '@core/components';
import { SeasonService } from '@core/services';
import { createMock, Mock } from '@testing-library/angular/jest-utils';
import { of } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';
import { RaceComponent } from './race.component';

describe('RaceComponent', () => {
  let component: RaceComponent;
  let fixture: ComponentFixture<RaceComponent>;
  let loader: HarnessLoader;
  let activatedRoute: Mock<ActivatedRoute>;

  beforeEach(async () => {
    const seasonService = createMock(SeasonService);
    activatedRoute = createMock(ActivatedRoute);
    await TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
        RouterTestingModule,
      ],
      providers: [
        {
          provide: SeasonService,
          useValue: seasonService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ season: '2022' })
          },
        },
      ],
      declarations: [RaceComponent, SeasonSelectComponentStub],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
