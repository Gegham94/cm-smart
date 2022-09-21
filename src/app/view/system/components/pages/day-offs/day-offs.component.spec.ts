import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOffsComponent } from './day-offs.component';

describe('DayOffComponent', () => {
  let component: DayOffsComponent;
  let fixture: ComponentFixture<DayOffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayOffsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
