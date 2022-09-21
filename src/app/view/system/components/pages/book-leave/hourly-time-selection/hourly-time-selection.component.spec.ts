import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyTimeSelectionComponent } from './hourly-time-selection.component';

describe('DayOffComponent', () => {
  let component: HourlyTimeSelectionComponent;
  let fixture: ComponentFixture<HourlyTimeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HourlyTimeSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyTimeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
