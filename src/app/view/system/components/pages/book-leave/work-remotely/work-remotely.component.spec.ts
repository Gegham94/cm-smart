import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkRemotelyComponent } from './work-remotely.component';

describe('WorkRemotelyComponent', () => {
  let component: WorkRemotelyComponent;
  let fixture: ComponentFixture<WorkRemotelyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkRemotelyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkRemotelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
