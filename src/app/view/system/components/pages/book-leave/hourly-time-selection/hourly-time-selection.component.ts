import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Leaves } from '@models/leaves';
import { DayOffsAndVacationsService } from '@services/day-offs-and-vacations.service';

import * as moment from 'moment';
@Component({
  selector: 'app-hourly-time-selection',
  templateUrl: './hourly-time-selection.component.html',
  styleUrls: ['./hourly-time-selection.component.scss'],
})
export class HourlyTimeSelectionComponent implements OnInit {
  errorWorkTime: boolean = true;
  @Output() errorWorkTimeOutput: EventEmitter<boolean> = new EventEmitter();

  @Input() leavesData!: any;
  @Input() dayOffs: any = {};
  isOpenTimeList = false;

  startWorkDayTime = new Date().setHours(9, 0, 0, 0);
  endWorkDayTime = new Date().setHours(19, 0, 0, 0);
  currentTime = new Date();

  displayCurrentTime = moment(this.currentTime).format('HH:mm');
  displayCurrentDay = moment(this.currentTime).format('MMM DD');

  @Output() bookedHourData: EventEmitter<any> = new EventEmitter();
  @Output() isOldLeave: EventEmitter<boolean> = new EventEmitter();

  bookHourData!: {
    start_day_time?: string;
    minutes?: string;
  };

  hoursList = [
    {
      id: 0,
      start_day_time: '',
      displayeTime: '',
      isSelected: false,
      isTime: false,
    },
  ];
  todayHourlyLeaves: Leaves[] = [];
  hourBusyLeavesList: any = {};

  minutes = [
    {
      id: 0,
      key: '15 minutes',
      value: '15',
      isSelected: false,
      disabled: false,
    },
    {
      id: 1,
      key: '30 minutes',
      value: '30',
      isSelected: false,
      disabled: false,
    },
    { id: 2, key: '1 hour', value: '60', isSelected: false, disabled: false },
    { id: 3, key: '2 hours', value: '120', isSelected: false, disabled: false },
    { id: 4, key: '3 hours', value: '180', isSelected: false, disabled: false },
    { id: 5, key: 'Half day', value: '240', isSelected: false, disabled: false },
  ];
  // today
  constructor(public dayOffsAndVacationsService: DayOffsAndVacationsService) {
    this.bookHourData = {
      start_day_time: moment(this.currentTime).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  ngOnInit(): void {
    let index = 0;
    const round = 1000 * 60 * 15;
    let userLeaveMinutes: string;

    if (this.leavesData) {
      this.displayCurrentDay = moment(this.leavesData.start_date).format('MMM DD');
      if (this.leavesData.start_day_time) {
        this.displayCurrentTime = moment(this.leavesData.start_day_time).format('HH:mm');
      } else {
        this.displayCurrentTime = moment(this.leavesData.start_date).format('HH:mm');
      }
      this.isOpenTimeList = true;
      if (this.leavesData.minutes) {
        userLeaveMinutes = this.leavesData.minutes;
      } else {
        userLeaveMinutes = (
          Math.floor(
            new Date(this.leavesData.end_date).getTime() -
              new Date(this.leavesData.start_date).getTime(),
          ) /
          1000 /
          60
        ).toString();
      }
      this.minutes.forEach((el) => {
        if (el.value === userLeaveMinutes) {
          el.isSelected = true;
        }
      });
      if (this.leavesData.start_day_time) {
        this.bookHourData = {
          start_day_time: moment(new Date(this.leavesData.start_day_time)).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          minutes: userLeaveMinutes.toString(),
        };
      } else {
        this.bookHourData = {
          start_day_time: moment(new Date(this.leavesData.start_date)).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          minutes: userLeaveMinutes.toString(),
        };
      }
      this.filterWorkingTime(this.leavesData.start_date);
    }

    while (
      this.currentTime.getTime() >= this.startWorkDayTime &&
      this.currentTime.getTime() < this.endWorkDayTime
    ) {
      const hoursListNextElement = this.currentTime.setMinutes(this.currentTime.getMinutes() + 15);
      const roundedHoursListNextElement =
        Math.round(new Date(hoursListNextElement).getTime() / round) * round;
      const roundedHoursListElement = new Date(roundedHoursListNextElement).setMinutes(
        new Date(roundedHoursListNextElement).getMinutes() + 0,
      );

      if (roundedHoursListElement < this.endWorkDayTime) {
        this.hoursList[index] = {
          id: index,
          start_day_time: moment(roundedHoursListElement).format('YYYY-MM-DD HH:mm:ss'),
          displayeTime: moment(roundedHoursListElement).format('HH:mm'),
          isSelected: false,
          isTime: true,
        };
        index++;
      } else {
        index++;
      }
    }

    if (this.hoursList.length < 6) {
      let emptyTimeField = 6 - this.hoursList.length;
      do {
        this.hoursList.push({
          id: index,
          start_day_time: '',
          displayeTime: '-- : --',
          isSelected: false,
          isTime: false,
        });
        emptyTimeField--;
      } while (emptyTimeField > 0);
    }

    this.hoursList.forEach((el) => {
      if (el.displayeTime === this.displayCurrentTime) {
        el.isSelected = true;
      }
    });
    if (!this.leavesData) this.filterWorkingTime();
    this.loadTodayHourlyLeaves();
    this.checkOldOrDayOffLeave();
  }
  private checkOldOrDayOffLeave(): void {
    const dateKey = moment().format('YYYY-MM-DD');
    const isOld = this.leavesData ? !moment().isSame(this.leavesData.start_date, 'day') : false;
    const isDayOff =
      this.dayOffs.hasOwnProperty(dateKey) && this.dayOffs[dateKey] !== 'Work Remotely';
    this.isOldLeave.emit(isOld || isDayOff);
  }
  private loadTodayHourlyLeaves(): void {
    this.dayOffsAndVacationsService.getDayOffs().subscribe((res) => {
      if (res.success) {
        const start = moment(this.leavesData?.start_date).format('h:mm');
        const end = moment(this.leavesData?.end_date).format('h:mm');
        this.todayHourlyLeaves = res.data.leaves.filter((leave) => {
          const date = moment(leave.start_date, 'DD-MM-YYYY');
          return (
            leave.type === 'Hourly Leave' &&
            moment().isSame(date, 'days') &&
            !(leave.time === `${start}-${end}`)
          );
        });
        for (const item of this.todayHourlyLeaves) {
          const time = item.time.split('-');
          const start = moment(time[0], 'h:mm');
          const end = moment(time[1], 'h:mm');
          while (start.isBefore(end)) {
            this.hourBusyLeavesList[start.format('h:mm')] = '';
            start.add(1, 'minute');
          }
          this.hourBusyLeavesList[start.format('h:mm')] = '';
        }
      }
    });
    this.isWorkingTimeMinute(String(this.bookHourData.minutes));
  }
  private isHourBusy(start: any, end: any): boolean {
    start = moment(start).format('h:mm');
    end = moment(end).format('h:mm');
    return (
      this.hourBusyLeavesList.hasOwnProperty(start) || this.hourBusyLeavesList.hasOwnProperty(end)
    );
  }
  openTimeList(): void {
    this.isOpenTimeList = !this.isOpenTimeList;
  }
  setStartLeave(startDayTime: string, elementId: number, isTime: boolean): void {
    if (isTime) {
      this.filterWorkingTime(startDayTime);
      for (const item of this.hoursList) {
        if (item.id !== elementId) {
          item.isSelected = false;
        } else {
          item.isSelected = !item.isSelected;
        }
      }
      this.displayCurrentTime = moment(startDayTime).format('HH:mm');
      this.bookHourData.start_day_time = startDayTime;
      this.bookedHourData.emit(this.bookHourData);
      this.isWorkingTimeMinute(String(this.bookHourData.minutes));
    }
  }
  setMinutes(minutes: string, elementId: number): void {
    this.isOpenTimeList = false;
    this.isWorkingTimeMinute(minutes);

    for (const item of this.minutes) {
      if (item.id !== elementId) {
        item.isSelected = false;
      } else {
        item.isSelected = !item.isSelected;
      }
    }
    this.bookHourData.minutes = minutes;
    this.bookedHourData.emit(this.bookHourData);
  }
  private isWorkingTimeMinute(minutes: string) {
    let btnDisabled = true;
    const startDate = this.bookHourData.start_day_time as string;
    const date = moment(
      new Date(startDate).setMinutes(new Date(startDate).getMinutes() + Number(minutes)),
    );
    if (moment(this.endWorkDayTime).isBefore(date)) {
      btnDisabled = false;
      this.errorWorkTime = false;
    } else this.errorWorkTime = true;
    if (this.isHourBusy(startDate, date)) {
      btnDisabled = false;
    }

    this.errorWorkTimeOutput.emit(btnDisabled);
  }
  private filterWorkingTime(date: any = new Date()) {
    if (date) date = new Date(date);
    let tempDate = date;
    for (const dateElement of this.minutes) {
      tempDate = new Date(date);
      const _date = moment(tempDate.setMinutes(tempDate.getMinutes() + Number(dateElement.value)));
      if (moment(this.endWorkDayTime).isBefore(_date)) dateElement.disabled = true;
      else dateElement.disabled = false;
    }
    if (this.minutes.find((item) => item.isSelected && item.disabled)) this.errorWorkTime = false;
    this.errorWorkTimeOutput.emit(this.errorWorkTime);
  }
}
