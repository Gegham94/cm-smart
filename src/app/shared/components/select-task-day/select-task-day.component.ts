import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Day } from './interfaces/day.interface';
import { weekDaysGenerator } from '../../../core/helpers/week-days-generator';

@Component({
  selector: 'app-select-task-day',
  templateUrl: './select-task-day.component.html',
  styleUrls: ['./select-task-day.component.scss'],
})
export class SelectTaskDayComponent implements OnInit, OnChanges {
  @Input()
  public dayFormGroup!: FormGroup;

  public currentWeekDays: Day[] = [];
  public nextWeekDays: Day[] = [];
  public nextWeekShown = false;

  public ngOnInit(): void {
    this.initializeComponent();
  }

  public ngOnChanges(): void {
    this.setDataFromFormGroup();
  }

  private setDataFromFormGroup(): void {
    if (this.dayFormGroup.get('day')?.value) {
      let currentActiveDate = this.currentWeekDays.find((day: Day) =>
        moment(day.date).isSame(this.dayFormGroup.get('day')?.value, 'date'),
      );

      if (!currentActiveDate) {
        currentActiveDate = this.nextWeekDays.find((day: Day) =>
          moment(day.date).isSame(this.dayFormGroup.get('day')?.value, 'date'),
        );
        this.nextWeekShown = true;
      } else {
        this.nextWeekShown = false;
      }

      if (currentActiveDate) {
        this.currentWeekDays.forEach((day) => (day.isChecked = false));
        this.nextWeekDays.forEach((day) => (day.isChecked = false));
        currentActiveDate.isChecked = true;
      }
    }
  }

  private initializeComponent(): void {
    const currentDate = new Date();

    if (currentDate.getDay() === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.currentWeekDays = weekDaysGenerator(currentDate).map((date: Date) => ({
      id: date.getDay(),
      date,
      isChecked: date.getDay() === currentDate.getDay(),
    }));
    if (!this.dayFormGroup.get('day')?.value) {
      const activeDate = this.currentWeekDays.find(
        (day) => day.date.getDay() === currentDate.getDay(),
      );

      if (activeDate) {
        this.setActiveDate(activeDate.id);
      }
    }

    if (currentDate.getDay() >= 5) {
      currentDate.setDate(currentDate.getDate() + 7);
      this.nextWeekDays = weekDaysGenerator(currentDate).map((date: Date) => ({
        id: date.getDay(),
        date,
        isChecked: false,
      }));
    }
    this.setDataFromFormGroup();
  }

  public setActiveDate(id: number): void {
    let arrayOfDates = this.currentWeekDays;

    if (this.nextWeekShown) {
      arrayOfDates = this.nextWeekDays;
    }

    let activeDate!: Day;
    arrayOfDates.forEach((day) => {
      if (day.id === id) {
        activeDate = day;
      }
      day.isChecked = false;
    });

    if (activeDate) {
      activeDate.isChecked = true;
      this.dayFormGroup.get('day')?.setValue(activeDate.date);
    } else {
      this.dayFormGroup.get('day')?.setValue(null);
    }
  }

  public setNextWeekShown(newValue: boolean): void {
    this.nextWeekShown = newValue;
    const arrayToShowNext = newValue ? this.nextWeekDays : this.currentWeekDays;
    const firstAvailableDay = arrayToShowNext.find((day) => !this.checkIfDayDisabled(day.date));

    if (firstAvailableDay) {
      this.setActiveDate(firstAvailableDay.id);
    }
  }

  public checkIfDayDisabled(date: Date): boolean {
    return !this.nextWeekShown && date.getDay() < new Date().getDay();
  }
}
