import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SeasonService } from '@core/services';
import { render } from '@testing-library/angular';
import { createMock, Mock } from '@testing-library/angular/jest-utils';
import { of } from 'rxjs';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { AppMaterialModule } from '../../../app-material.module';
import { SeasonSelectComponent } from './season-select.component';

describe('SeasonSelectComponent', () => {
  let component: SeasonSelectComponent;
  let fixture: ComponentFixture<SeasonSelectComponent>;
  let seasonService: Mock<SeasonService>;
  let loader: HarnessLoader;
  
  beforeEach(() => {
    seasonService = createMock(SeasonService);
    jest
      .spyOn(seasonService, 'getSeasons')
      .mockImplementation(() => of(['2022', '2021', '2020']));
  });

  describe('No inputs', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [SeasonSelectComponent],
        providers: [
          {
            provide: SeasonService,
            useValue: seasonService,
          },
        ],
        imports: [
          AppMaterialModule,
          BrowserAnimationsModule.withConfig({ disableAnimations: true }),
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(SeasonSelectComponent);
      component = fixture.componentInstance;
      loader = TestbedHarnessEnvironment.loader(fixture);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get seasons on init', () => {
      expect(seasonService.getSeasons).toHaveBeenCalled();
    });

    it('should get seasons and set initial value', () => {
      expect(fixture.componentInstance.seasonControl.value).toEqual('2021');
    });

    it('should emit change on select change', async () => {
      jest.spyOn(fixture.componentInstance.change, 'emit').mockImplementation();
      fixture.detectChanges();

      const selector = await loader.getHarness(MatSelectHarness);
      await selector.open();
      const options = await selector.getOptions();
      await options[0].click();
      
      expect(fixture.componentInstance.change.emit).toHaveBeenCalledWith('2022');
    });

    it('should unsubscribe onDestroy', () => {
      jest.spyOn(fixture.componentInstance.subscription, 'unsubscribe');

      fixture.componentInstance.ngOnDestroy();
      fixture.detectChanges;
  
      expect(fixture.componentInstance.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('With inputs', () => {
    it('should set different initial value if provided', async () => {
      const component = await render(SeasonSelectComponent, {
        componentProperties: { initialSeason: '2022' },
        providers: [
          {
            provide: SeasonService,
            useValue: seasonService,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });

      expect(component.fixture.componentInstance.seasonControl.value).toEqual(
        '2022'
      );
    });
  });
});
