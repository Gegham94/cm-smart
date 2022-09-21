import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MonthList } from '../../constants/month-list.constant';
import { CustomDateAdapter } from '../../../core/helpers/custom-date-adapter';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeaderComponent implements OnDestroy {
  private destroyed: Subject<void> = new Subject<void>();
  public readonly monthList = MonthList;
  public readonly currentMonth: number = new Date().getMonth();

  constructor(
    private readonly calendar: MatCalendar<Date>,
    private readonly dateAdapter: CustomDateAdapter,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DATE_FORMATS) private readonly dateFormats: MatDateFormats,
  ) {
    calendar.stateChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => changeDetectorRef.markForCheck());
  }

  public ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public setMonth(event: MatSelectChange): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(
      this.calendar.activeDate,
      event.value - this.calendar.activeDate.getMonth(),
    );
  }

  public get selectedMonth(): number {
    return this.calendar.activeDate.getMonth();
  }

  public get selectedYear(): number {
    return this.calendar.activeDate.getFullYear();
  }
}
