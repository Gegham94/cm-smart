import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatCalendar,
  MatCalendarCellClassFunction,
  MatRangeDateSelectionModel,
} from '@angular/material/datepicker';
import { HolidaysData } from '@models/holidays-data';
import { HolidaysService } from '../../../../../../core/services';

@Component({
  selector: 'app-datepicker-range',
  templateUrl: './datepicker-range.component.html',
  styleUrls: ['./datepicker-range.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
    DefaultMatCalendarRangeStrategy,
    MatRangeDateSelectionModel,
  ],
})
export class DatepickerRangeHeaderComponent implements OnInit, OnChanges, OnDestroy {
  loader$ = new Subject<boolean>();
  datepickerRangeHeader = DatepickerRangeComponent;
  @Input() dayOffs: any = {};
  @Input() dateRange!: DateRange<Date>;
  @Input() remainingDays = 0;
  @Output() dateRangeSelected: EventEmitter<any> = new EventEmitter();
  // range date picker
  minDate: Date = moment().add(1, 'day').toDate();
  maxDate: Date = moment().add(1, 'year').toDate();
  isVacationRemaining: boolean = true;
  holidaysByDate: any = {};
  holidays: { [name: string]: HolidaysData } = {};
  holidaysList: HolidaysData[] = [];
  @Output() isOldLeave: EventEmitter<boolean> = new EventEmitter();
  @Output() pickerError: EventEmitter<boolean> = new EventEmitter();
  @Output() vacationIsOver: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private readonly selectionModel: MatRangeDateSelectionModel<Date>,
    private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
    private holidaysService: HolidaysService,
  ) {}

  ngOnDestroy(): void {
    this.loader$.unsubscribe();
  }
  ngOnInit(): void {
    if (this.dateRange) {
      if (
        moment().isAfter(this.dateRange.end) ||
        moment(this.minDate).isAfter(this.dateRange.start, 'day')
      ) {
        this.minDate = moment(this.dateRange.start).toDate();
        this.maxDate = moment(this.dateRange.end).toDate();
      }
    }

    if (this.remainingDays >= 3) {
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

  ngOnChanges(): void {
    if (this.dateRange) {
      const defaultSelectedStartDay = new Date(this.dateRange.start || '');
      const defaultSelectedEndDay = new Date(this.dateRange.end || '');
      this.dateRange = new DateRange(defaultSelectedStartDay, defaultSelectedEndDay);
    }
  }
  private checkOldLeave(): void {
    if (this.dateRange) {
      const isOldLeave = moment().isAfter(this.dateRange.end);
      if (isOldLeave || moment(this.minDate).isAfter(this.dateRange.start, 'day')) {
        this.minDate = moment(this.dateRange.start).toDate();
        this.maxDate = moment(this.dateRange.end).toDate();
      }
      this.isOldLeave.emit(isOldLeave);
    }
  }
  private isDayHoliday(date: any): boolean {
    date = moment(date).format('YYYY-MM-DD');
    const isworkingDay: any = this.holidays[date]?.is_working_day;
    return isworkingDay === 0 && !!this.holidays[date];
  }
  rangeChanged(selectedDate: Date): void {
    const timeOfMoment = moment(selectedDate).format('YYYY-MM-DD');
    selectedDate = new Date(timeOfMoment);

    const selection = this.selectionModel.selection;
    const newSelection = this.selectionStrategy.selectionFinished(selectedDate, selection);

    this.selectionModel.updateSelection(newSelection, this);
    this.dateRange = new DateRange<Date>(newSelection.start, newSelection.end);

    if (this.selectionModel.isComplete()) {
      const vacationSelectedDays = this.diffDays(this.dateRange.start, this.dateRange.end);
      this.isVacationRemaining =
        vacationSelectedDays <= this.remainingDays && vacationSelectedDays >= 3;
      if (
        this.isVacationRemaining &&
        this.isDateRangeWorkingDay(this.dateRange.start, this.dateRange.end)
      ) {
        this.pickerError.emit(false);
      } else {
        this.pickerError.emit(true);
      }
      this.dateRangeSelected.emit(this.dateRange);
    } else {
      this.pickerError.emit(true);
    }
  }

  private isDateRangeWorkingDay(start: any, end: any): boolean {
    for (const date of this.getRange(start, end)) {
      if (this.isDayOff(date)) return false;
    }
    return true;
  }
  private getRange(startDate: any, endDate: any) {
    const fromDate = moment(startDate);
    const toDate = moment(endDate);
    const diff = toDate.diff(fromDate, 'day');
    let currentDay = fromDate;
    const range: any = [];
    for (let i = 0; i <= diff; i++) {
      range.push(currentDay);
      currentDay = moment(currentDay).add(1, 'day');
    }
    return range;
  }
  private diffDays(start: any, end: any): number {
    let diff = 0;
    for (const date of this.getRange(start, end)) {
      diff += this.isDayOff(date) || this.isDayHoliday(date) || this.isDayWeekend(date) ? 0 : 1;
    }
    return diff;
  }
  private isDayWeekend(date: any) {
    date = moment(date);
    const day = date.isoWeekday();
    return day === 6 || day === 7;
  }
  private isDayOff(date: any) {
    const keyDate = moment(date).format('YYYY-MM-DD');
    return this.dayOffs.hasOwnProperty(keyDate);
  }
  dateClass: MatCalendarCellClassFunction<any> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      if (this.isDayHoliday(cellDate)) {
        return 'example-custom-date-holiday-class ';
      } else if (this.isDayOff(cellDate)) {
        return 'example-custom-date-disabled-class';
      }
      return '';
    }
    return '';
  };
}

@Component({
  templateUrl: './datepicker-range-header.component.html',
  styleUrls: ['./datepicker-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerRangeComponent<D> implements OnDestroy {
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
