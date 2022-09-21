import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { HeaderService } from '@services/header.service';
import { DayOffsAndVacationsService } from '@services/day-offs-and-vacations.service';
import { Leaves } from '@models/leaves';
import { Annual } from '@models/annual';
import { Vacations } from '@models/vacations';

import { BookLeaveComponent } from '../book-leave/book-leave.component';
import { chartData, colorScheme, dataRangeOptions } from '../about/about-chart-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-day-offs',
  templateUrl: './day-offs.component.html',
  styleUrls: ['./day-offs.component.scss'],
})
export class DayOffsComponent implements OnInit {
  leaveFilteredBy?: string;
  // pie
  projectView: any = [210, 210];

  rangeLeaveCalendarFilter = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  progressTaskView: any;

  progressTask = {
    colorScheme,
    dataRangeOptions,
    chartData,
    isOpenDataList: false,
  };

  leavesData!: Leaves[];
  leavesTable!: Leaves[];
  dayOffColumns: string[] = ['Date', 'Time', 'Type', 'Amount', 'Description'];
  vacationsColumn: string[] = ['From', 'To', 'Type', 'Amount', 'Description'];
  leavesDataSource: Leaves[] = [];
  leavesDataFiltered: Leaves[] = [];
  vacationsDataSrource!: Vacations[];
  annualData!: Annual;
  vacations!: Vacations[];
  scrollClassVacation = false;
  scrollClassDayOff = false;
  annualTotal!: number;
  annualVacation!: number;
  annualDayOffs!: number;
  annualHoursLeave!: number;
  remainingDays!: number;
  workRemotely!: number;
  annualTotalTitle!: number;
  isDataGetted = false;

  projectChart: any = {
    chartData,
    colorScheme: {
      domain: ['#F4C584', '#83B7AD', '#EF988F', '#92BEFA'],
    },
    single: [],
  };

  constructor(
    public headerService: HeaderService,
    public dayOffsAndVacationsService: DayOffsAndVacationsService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Day offs and vacations');
    this.getDayOffs();
  }

  getDayOffs(): void {
    this.dayOffsAndVacationsService.getDayOffs().subscribe((res) => {
      this.leavesData = res.data.leaves;
      this.vacations = res.data.vacations;
      this.leavesTable = this.leavesData;
      this.leavesDataSource = this.leavesTable;
      this.annualData = res.data.annual_data;

      this.annualTotal = this.annualData.total;
      this.annualVacation = this.annualData.vacation;
      this.annualDayOffs = this.annualData.day_offs;
      this.annualHoursLeave = this.annualData.hours_leave;
      this.remainingDays = this.annualTotal - this.annualDayOffs - this.annualVacation;
      this.vacationsDataSrource = this.vacations;
      this.vacations.length > 5
        ? (this.scrollClassVacation = true)
        : (this.scrollClassVacation = false);
      this.leavesData.length > 5
        ? (this.scrollClassDayOff = true)
        : (this.scrollClassDayOff = false);
      this.isDataGetted = true;

      this.workRemotely = 0;
      res.data.leaves.forEach((current: Leaves) => {
        if (current.type === 'Work Remotely') {
          this.workRemotely++;
        }
      });
      this.annualTotalTitle = this.annualDayOffs + this.annualVacation;
      this.projectChart.single = [
        {
          name: 'Work remotely',
          value: this.workRemotely,
        },
        {
          name: 'Vacation',
          value: this.annualVacation,
        },
        {
          name: 'Day Offs',
          value: this.annualDayOffs,
        },
        {
          name: 'Hours Leaved',
          value: this.annualHoursLeave,
        },
      ];
      this.sortLeaves();
      this.setFilterLeave();
    });
  }

  openBookLeave(detailId?: number, amountVacation?: number): void {
    document.querySelector<HTMLElement>('#day-offs-content')!.style.pointerEvents = 'none';

    const dialogConfig = new MatDialogConfig();
    let dialogRef;

    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-MatDialog';

    if (!detailId) {
      dialogConfig.data = {
        remainingDays: this.remainingDays,
        annualLeave: this.annualDayOffs + this.annualVacation,
        leavesData: this.leavesData,
        isEditDayOffs: false,
      };
      dialogRef = this.dialog.open(BookLeaveComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(() => {
        this.getDayOffs();
        document.querySelector<HTMLElement>('#day-offs-content')!.style.pointerEvents = 'auto';
      });
    }
    if (detailId) {
      this.dayOffsAndVacationsService.getDayOffsDetail(detailId).subscribe((res) => {
        dialogConfig.data = {
          remainingDays: this.remainingDays,
          annualLeave: this.annualDayOffs + this.annualVacation,
          leavesData: res,
          isEditDayOffs: true,
        };
        if (amountVacation) dialogConfig.data.amountVacation = amountVacation;
        dialogRef = this.dialog.open(BookLeaveComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((_) => {
          this.getDayOffs();
          document.querySelector<HTMLElement>('#day-offs-content')!.style.pointerEvents = 'auto';
        });
      });
    }
  }
  getAnnualHoursLeave(hours: number): string {
    const minutes = hours * 60;
    const hour = Math.trunc(minutes / 60);
    const minute = minutes - hour * 60;
    const hourView = hour !== 0 ? `${hour} h ` : '';
    const minuteView = minute !== 0 ? `${minute} min ` : '';
    return `${hourView} ${hourView && minuteView ? 'and' : ''}  ${minuteView}`;
  }
  private sortLeaves(): void {
    this.leavesDataSource.sort((a, b) => {
      const nextDate = moment(b.start_date, 'DD.MM.YYYY');
      return moment(a.start_date, 'DD.MM.YYYY').isAfter(nextDate) ? -1 : 1;
    });
    this.vacationsDataSrource.sort((a, b) => {
      const nextDate = moment(b.start_date, 'DD.MM.YYYY');
      return moment(a.start_date, 'DD.MM.YYYY').isAfter(nextDate) ? -1 : 1;
    });
  }
  setFilterLeave(keyName?: string): void {
    this.leavesDataFiltered = this.leavesDataSource;
    if (this.leaveFilteredBy && !keyName) {
      keyName = this.leaveFilteredBy;
      this.resetFilter();
    }
    const startDate = moment(this.rangeLeaveCalendarFilter.controls.start.value).date();
    const endDate = moment(this.rangeLeaveCalendarFilter.controls.end.value).date();

    this.leavesDataFiltered = this.leavesDataSource.filter((item) => {
      if (this.rangeLeaveCalendarFilter.valid) {
        const currentDate = moment(item.start_date, 'DD.MM.YYYY').date();
        return (
          startDate <= currentDate && currentDate <= endDate && (item.type === keyName || !keyName)
        );
      }
      return !keyName || item.type === keyName;
    });

    this.leaveFilteredBy = keyName;
  }
  resetFilter(): void {
    this.leaveFilteredBy = undefined;
    this.setFilterLeave();
  }
  resetCalendarFilter(): void {
    this.rangeLeaveCalendarFilter.reset();
    this.setFilterLeave();
  }
}
