import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLeaveComponent } from './book-leave.component';

describe('BookLeaveComponent', () => {
  let component: BookLeaveComponent;
  let fixture: ComponentFixture<BookLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookLeaveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
