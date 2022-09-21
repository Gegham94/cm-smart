import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyLeaveComponent } from './hourly-leave.component';

describe('HourlyLeaveComponent', () => {
  let component: HourlyLeaveComponent;
  let fixture: ComponentFixture<HourlyLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HourlyLeaveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
