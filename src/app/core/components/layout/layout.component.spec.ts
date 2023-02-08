import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMaterialModule } from '../../../app-material.module';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutComponent, ToolbarComponent],
      imports: [AppMaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
