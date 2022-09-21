import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '@services/notifications.service';
import * as moment from 'moment';
import { DayOffsAndVacationsService } from '@services/day-offs-and-vacations.service';
@Component({
  selector: 'app-book-leave',
  templateUrl: './book-leave.component.html',
  styleUrls: ['./book-leave.component.scss'],
})
export class BookLeaveComponent implements OnInit {
  vacationIsOver = false;
  isLoadedDayOffs = false;
  dayOffsDayList: any = {};
  submitDisabled = false;
  submitDisabledHourlyLeave = false;
  selectedTab = 'hourly_leave';
  loading = false;
  loadingCancel = false;
  isReadyToBook = false;

  leavesData!: any;

  dateDayOff: any;
  displaySelectedDayOffDate!: string;
  dayOffDescriptionText = '';

  dateWorkRemotely: any;
  displaySelectedWorkRemotelyDate!: string;
  workRemotelyDescriptionText = '';
  datOffRemaining = 0;
  dateRange!: any;
  displaySelectedDateRange!: string;
  vacationDescriptionText = '';
  vacationDaysRemaining = 0;

  selectedDateTime: any;
  displaySelectedDate!: string;
  displaySelectedTime!: string;
  displayLeaveTime!: string;
  hourlyLeaveDescriptionText = '';
  isOldLeave = false;
  constructor(
    public dialogRef: MatDialogRef<any>,
    private notifyService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public userBookedDaysData: any,
    private dayOffsAndVacationsService: DayOffsAndVacationsService,
  ) {}

  ngOnInit(): void {
    if (this.userBookedDaysData.isEditDayOffs) {
      document
        .querySelectorAll<HTMLElement>('#day_off, #vacation, #work_remotely, #hourly_leave')
        .forEach((el) => {
          el.style.pointerEvents = 'none';
        });
      switch (this.userBookedDaysData.leavesData.data.type) {
        case 1:
          this.datOffRemaining = 1;
          this.selectedTab = 'day_off';
          this.dayOffDescriptionText = this.userBookedDaysData.leavesData.data.reason;
          this.getSelectedDate(this.userBookedDaysData.leavesData.data.start_date);
          break;
        case 2:
          this.vacationDaysRemaining = this.userBookedDaysData.amountVacation;
          this.selectedTab = 'vacation';
          this.vacationDescriptionText = this.userBookedDaysData.leavesData.data.reason;
          this.getSelectedDateRange({
            start: this.userBookedDaysData.leavesData.data.start_date,
            end: this.userBookedDaysData.leavesData.data.end_date,
          });
          break;
        case 3:
          this.selectedTab = 'work_remotely';
          this.workRemotelyDescriptionText = this.userBookedDaysData.leavesData.data.reason;
          this.getSelectedDate(this.userBookedDaysData.leavesData.data.start_date);
          break;
        case 4:
          this.selectedTab = 'hourly_leave';
          this.leavesData = this.userBookedDaysData.leavesData.data;
          this.submitDisabledHourlyLeave = moment().isAfter(this.leavesData.end_date, 'day');
          this.hourlyLeaveDescriptionText = this.userBookedDaysData.leavesData.data.reason;
          this.getSelectedTime({
            start_day_time: this.userBookedDaysData.leavesData.data.start_date,
            end_day_time: this.userBookedDaysData.leavesData.data.end_date,
            minutes: (
              Math.floor(
                new Date(this.leavesData.end_date).getTime() -
                  new Date(this.leavesData.start_date).getTime(),
              ) /
              1000 /
              60
            ).toString(),
          });
          break;
      }
      this.readyForBook();
    }
    this.getDayOffList();
  }

  closeBookLeave(res = true): void {
    this.loading = false;
    this.loadingCancel = false;
    this.isReadyToBook = false;
    this.dialogRef.close(res);
  }

  clickTab(tabName: string): void {
    this.isOldLeave = false;
    switch (tabName) {
      case 'hourly_leave':
        if (this.selectedDateTime && this.hourlyLeaveDescriptionText) {
          this.isReadyToBook = true;
          this.leavesData = this.selectedDateTime;
        } else {
          this.isReadyToBook = false;
        }
        this.selectedTab = 'hourly_leave';
        break;
      case 'day_off':
        if (this.dateDayOff && this.dayOffDescriptionText) {
          this.isReadyToBook = true;
        } else {
          this.isReadyToBook = false;
        }
        this.selectedTab = 'day_off';
        break;
      case 'work_remotely':
        if (this.dateWorkRemotely && this.workRemotelyDescriptionText) {
          this.isReadyToBook = true;
        } else {
          this.isReadyToBook = false;
        }
        this.selectedTab = 'work_remotely';
        break;
      case 'vacation':
        this.isReadyToBook = !!(this.dateRange && this.vacationDescriptionText);
        this.selectedTab = 'vacation';
        console.log('heheheeeeee');
        this.getSelectedDateRange({
          start: this.userBookedDaysData.leavesData.data?.start_date,
          end: this.userBookedDaysData.leavesData.data?.end_date,
        });
        break;
      default:
        if (this.selectedDateTime && this.hourlyLeaveDescriptionText) {
          this.isReadyToBook = true;
          this.leavesData = this.selectedDateTime;
        } else {
          this.isReadyToBook = false;
        }
        this.selectedTab = 'hourly_leave';
        break;
    }
  }

  getSelectedDate(date: any): void {
    switch (this.selectedTab) {
      case 'day_off':
        this.dateDayOff = moment(date).format('yyyy-MM-DD');
        this.displaySelectedDayOffDate = moment(date).format('MMM DD');
        this.readyForBook();
        break;
      case 'work_remotely':
        this.dateWorkRemotely = moment(date).format('yyyy-MM-DD');
        this.displaySelectedWorkRemotelyDate = moment(date).format('MMM DD');
        this.readyForBook();
        break;
    }
  }

  getSelectedDateRange(dateRange: any): void {
    this.dateRange = dateRange;
    if (moment(dateRange.start).format('MMM') === moment(dateRange.end).format('MMM')) {
      this.displaySelectedDateRange =
        moment(dateRange.start).format('MMM') +
        ' ' +
        moment(dateRange.start).format('DD') +
        '-' +
        moment(dateRange.end).format('DD');
    } else {
      this.displaySelectedDateRange =
        moment(dateRange.start).format('MMM DD') + ' - ' + moment(dateRange.end).format('MMM DD');
    }
    this.readyForBook();
  }

  getSelectedTime(date: any): void {
    this.selectedDateTime = date;
    this.displaySelectedDate = moment(date.start_day_time).format('MMM DD');
    this.displaySelectedTime = moment(date.start_day_time).format('HH:mm');
    if (date.minutes) {
      this.displayLeaveTime = moment(
        new Date(date.start_day_time).setMinutes(
          new Date(date.start_day_time).getMinutes() + Number(date.minutes),
        ),
      ).format('HH:mm');
      if (date.start_day_time && this.hourlyLeaveDescriptionText) {
        this.isReadyToBook = true;
      }
    }
    if (date.end_day_time) {
      this.displayLeaveTime = moment(date.end_day_time).format('HH:mm');
      if (date.start_day_time && this.hourlyLeaveDescriptionText) {
        this.isReadyToBook = true;
      }
    }
  }

  readyForBook(): void {
    switch (this.selectedTab) {
      case 'hourly_leave':
        if (
          this.hourlyLeaveDescriptionText &&
          this.selectedDateTime?.start_day_time &&
          (this.selectedDateTime?.minutes || this.selectedDateTime?.end_day_time)
        ) {
          this.isReadyToBook = true;
        } else {
          this.isReadyToBook = false;
        }
        break;
      case 'day_off':
        if (this.dateDayOff && this.dayOffDescriptionText) {
          this.isReadyToBook = true;
        } else {
          this.isReadyToBook = false;
        }
        break;
      case 'work_remotely':
        if (this.dateWorkRemotely && this.workRemotelyDescriptionText) {
          this.isReadyToBook = true;
        } else {
          this.isReadyToBook = false;
        }
        break;
      case 'vacation':
        if (this.dateRange?.start && this.dateRange?.end && this.vacationDescriptionText) {
          this.isReadyToBook = true;
        } else {
          this.isReadyToBook = false;
        }
        break;
    }
  }

  deleteBookedDay(): void {
    this.loadingCancel = true;
    const leaveId = this.userBookedDaysData.leavesData.data.id;
    this.dayOffsAndVacationsService.deleteDayOffById(leaveId).subscribe(
      (response: any) => {
        if (response.success === true) {
          this.notifyService.showSuccess('Time successfuly canceled', 'Greate !');
          this.closeBookLeave();
          return;
        }
      },
      (err) => {
        this.loadingCancel = false;
        this.notifyService.showError(`${err.message}`, '');
      },
    );
  }

  bookDay(isUpdate?: boolean): void {
    let bookLeaveId;
    let bookLeaveRequest;

    switch (this.selectedTab) {
      case 'hourly_leave':
        if (new Date().getDay() === 6 || new Date().getDay() === 0) {
          this.notifyService.showInfo('', 'Today is Weekend !');
        } else {
          this.loading = true;
          if (isUpdate) {
            bookLeaveId = this.userBookedDaysData.leavesData.data.id;
            bookLeaveRequest = this.dayOffsAndVacationsService.updateHourlyLeave(
              this.selectedDateTime.start_day_time,
              this.selectedDateTime.minutes,
              this.hourlyLeaveDescriptionText,
              bookLeaveId,
            );
          } else {
            bookLeaveRequest = this.dayOffsAndVacationsService.takeHourlyLeave(
              this.selectedDateTime.start_day_time,
              this.selectedDateTime.minutes,
              this.hourlyLeaveDescriptionText,
            );
          }
          bookLeaveRequest.subscribe(
            (response: any) => {
              if (response.success === true) {
                this.notifyService.showSuccess('Time successfuly booked', 'Greate !');
                this.closeBookLeave();
                return;
              }
            },
            (err) => {
              this.loading = false;
              this.notifyService.showError(`${err.message}`, '');
            },
          );
        }
        break;

      case 'day_off':
        if (new Date(this.dateDayOff).getDay() === 6 || new Date(this.dateDayOff).getDay() === 0) {
          this.notifyService.showInfo('', 'Requested day is Weekend !');
        } else {
          this.loading = true;
          if (isUpdate) {
            bookLeaveId = this.userBookedDaysData.leavesData.data.id;
            bookLeaveRequest = this.dayOffsAndVacationsService.updateDayOff(
              this.dateDayOff,
              this.dayOffDescriptionText,
              bookLeaveId,
            );
          } else {
            bookLeaveRequest = this.dayOffsAndVacationsService.takeDayOff(
              this.dateDayOff,
              this.dayOffDescriptionText,
            );
          }
          bookLeaveRequest.subscribe(
            (response: any) => {
              if (response.success === true) {
                this.notifyService.showSuccess('Time successfuly booked', 'Greate !');
                this.closeBookLeave();
                return;
              }
            },
            (err) => {
              this.loading = false;
              this.notifyService.showError(`${err.message}`, '');
            },
          );
        }
        break;

      case 'work_remotely':
        if (
          new Date(this.dateWorkRemotely).getDay() === 6 ||
          new Date(this.dateWorkRemotely).getDay() === 0
        ) {
          this.notifyService.showInfo('', 'Requested day is Weekend !');
        } else {
          this.loading = true;
          if (isUpdate) {
            bookLeaveId = this.userBookedDaysData.leavesData.data.id;
            bookLeaveRequest = this.dayOffsAndVacationsService.updateWorkRemotely(
              this.dateWorkRemotely,
              this.workRemotelyDescriptionText,
              bookLeaveId,
            );
          } else {
            bookLeaveRequest = this.dayOffsAndVacationsService.takeWorkRemotely(
              this.dateWorkRemotely,
              this.workRemotelyDescriptionText,
            );
          }
          bookLeaveRequest.subscribe(
            (response: any) => {
              if (response.success === true) {
                this.notifyService.showSuccess('Time successfuly booked', 'Greate !');
                this.closeBookLeave();
                return;
              }
            },
            (err) => {
              this.loading = false;
              this.notifyService.showError(`${err.message}`, '');
            },
          );
        }
        break;

      case 'vacation':
        this.loading = true;
        const start = moment(this.dateRange.start).format('YYYY-MM-DD');
        const end = moment(this.dateRange.end).format('YYYY-MM-DD');
        if (isUpdate) {
          bookLeaveId = this.userBookedDaysData.leavesData.data.id;
          bookLeaveRequest = this.dayOffsAndVacationsService.updateVacations(
            start,
            end,
            this.vacationDescriptionText,
            bookLeaveId,
          );
        } else {
          bookLeaveRequest = this.dayOffsAndVacationsService.takeVacations(
            start,
            end,
            this.vacationDescriptionText,
          );
        }
        bookLeaveRequest.subscribe(
          (response: any) => {
            if (response.success === true) {
              this.notifyService.showSuccess('Time successfuly booked', 'Greate !');
              this.closeBookLeave();
              return;
            }
          },
          (err) => {
            this.loading = false;
            this.notifyService.showError(`${err.message}`, '');
          },
        );
        break;
    }
  }
  getDayOffList(): void {
    this.dayOffsAndVacationsService.getDayOffs().subscribe((res) => {
      if (!res.success) return;
      for (const vacation of res.data.vacations) {
        const start = moment(vacation.start_date, 'DD-MM-YYYY');
        const end = moment(vacation.end_date, 'DD-MM-YYYY');
        if (this.dateRange && start.isSame(this.dateRange.start) && end.isSame(this.dateRange.end))
          continue;
        this.rangeDate(start, end);
      }

      for (const leave of res.data.leaves) {
        if (leave.type != 'Hourly Leave') {
          const start = moment(leave.start_date, 'DD-MM-YYYY');
          if (start.isSame(this.dateDayOff) || start.isSame(this.dateWorkRemotely)) continue;
          this.addDate(start, leave.type);
        }
      }
      this.isLoadedDayOffs = true;
    });
  }
  private addDate(date: moment.Moment, type: string = ''): void {
    const keyDate = date.format('YYYY-MM-DD');
    if (!this.dayOffsDayList.hasOwnProperty(keyDate)) {
      this.dayOffsDayList[keyDate] = type;
    }
  }
  private rangeDate(startDate: moment.Moment, endDate: moment.Moment = startDate): void {
    let currentDate = startDate;
    while (currentDate.isBefore(endDate)) {
      this.addDate(currentDate, 'Vacation');
      currentDate = moment(currentDate).add(1, 'day');
    }
    this.addDate(currentDate, 'Vacation');
  }

  setVacationIsOver($event: boolean = false): void {
    setTimeout(() => (this.vacationIsOver = $event));
  }
}
