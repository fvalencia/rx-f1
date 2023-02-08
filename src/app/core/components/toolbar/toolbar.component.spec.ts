import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AppMaterialModule } from '../../../app-material.module';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let loader: HarnessLoader;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [AppMaterialModule, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate', () => {
    jest.spyOn(router, 'navigate').mockImplementation();

    fixture.componentInstance.navigate('/abc');
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/abc']);
  });

  it('should render and trigger navigate with routes', async () => {
    jest.spyOn(fixture.componentInstance, 'navigate').mockImplementation();
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    const routes = fixture.componentInstance.routes;

    for (let i = 0; i < routes.length; i++) {
      const text = await buttons[i].getText();
      expect(text).toEqual(routes[i].name);

      await buttons[i].click();
      expect(fixture.componentInstance.navigate).toHaveBeenCalledWith(
        routes[i].url
      );
    }
  });
});
