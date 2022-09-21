import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { HolidaysData } from '@models/holidays-data';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HolidaysService } from '../../../../../../core/services';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerHeaderComponent implements OnInit, OnDestroy {
  @Input() remainingDays!: number;
  datepickerHeader = DatepickerComponent;
  loader$ = new Subject<boolean>();
  @Input() dayOffs: any = {};
  @Input() date!: any;
  @Output() dateSelected: EventEmitter<any> = new EventEmitter();
  @Output() headerError: EventEmitter<boolean> = new EventEmitter();
  @Output() vacationIsOver: EventEmitter<boolean> = new EventEmitter();
  @Output() isOldLeave: EventEmitter<boolean> = new EventEmitter();
  // range datepicker
  minDate: Date = moment().add(1, 'day').toDate();
  maxDate: Date = moment().add(1, 'year').toDate();
  holidays: { [name: string]: HolidaysData } = {};
  holidaysList: HolidaysData[] = [];

  constructor(private holidaysService: HolidaysService) {}
  ngOnInit(): void {
    if (this.date) {
      if (moment().isAfter(this.date)) {
        this.minDate = moment(this.date).toDate();
        this.maxDate = moment(this.date).toDate();
      }
    }
    if (this.remainingDays >= 1) {
      this.vacationIsOver.emit(false);
    } else {
      this.vacationIsOver.emit(true);
    }
    this.holidaysService.getHoliday().subscribe((res) => {
      if (res.success) {
        this.holidaysList = res.data;
        for (const holiday of res.data) {
          this.holidays[holiday.date] = holiday;
        }
      }
      this.loader$.next(false);
    });
    this.checkOldLeave();
  }
  private checkOldLeave(): void {
    if (this.date) {
      const isOldLeave = moment().isAfter(this.date);
      if (isOldLeave) {
        this.minDate = moment(this.date).toDate();
        this.maxDate = moment(this.date).toDate();
      }
      this.isOldLeave.emit(isOldLeave);
    }
  }
  setSelectedDate(): void {
    if (!(this.remainingDays >= 1) || this.isDayOff(this.date) || moment().isSame(this.date)) {
      this.headerError.emit(true);
      return;
    }
    this.headerError.emit(false);
    this.dateSelected.emit(this.date);
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      if (this.isDayHoliday(cellDate)) {
        return 'example-custom-date-holiday-class';
      } else if (this.isDayOff(cellDate)) {
        return 'example-custom-date-disabled-class ';
      }
      return '';
    }
    return '';
  };
  private isDayHoliday(date: any): boolean {
    date = moment(date).format('YYYY-MM-DD');
    const isworkingDay: any = this.holidays[date]?.is_working_day;
    return isworkingDay === 0 && !!this.holidays[date];
  }
  private isDayOff(date: any): boolean {
    const keyDate = moment(date).format('YYYY-MM-DD');
    return this.dayOffs.hasOwnProperty(keyDate);
  }
  ngOnDestroy(): void {
    this.loader$.unsubscribe();
  }
}

@Component({
  templateUrl: './datepicker-header.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent<D> implements OnDestroy {
  private destroyed = new Subject<void>();

  constructor(
    private calendar: MatCalendar<D>,
    private dateAdapter: DateAdapter<D>,
    cdr: ChangeDetectorRef,
  ) {
    calendar.stateChanges.pipe(takeUntil(this.destroyed)).subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  get periodLabel(): string {
    return moment(this.calendar.activeDate).format('MMMM');
  }

  previousClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
  }
  nextClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
  }
}
