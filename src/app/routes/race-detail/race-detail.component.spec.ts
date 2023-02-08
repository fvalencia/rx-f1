import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SeasonSelectComponentStub } from '@core/components';
import { SeasonService } from '@core/services';
import { createMock } from '@testing-library/angular/jest-utils';
import { of } from 'rxjs';

import { AppMaterialModule } from '../../app-material.module';
import { RaceDetailComponent } from './race-detail.component';

describe('RaceDetailComponent', () => {
  let component: RaceDetailComponent;
  let fixture: ComponentFixture<RaceDetailComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const seasonService = createMock(SeasonService);
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
            params: of({ season: '2022' }),
          },
        },
      ],
      declarations: [RaceDetailComponent, SeasonSelectComponentStub],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RaceDetailComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
