import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToDoListData } from '@models/to-do-list-data';
import { ToDoService } from '@services/to-do.service';
import * as moment from 'moment/moment';
import { CreateUpdateTaskComponent } from '../task/create-update-task-model/create-update-task.component';
import { ToastrService } from 'ngx-toastr';
import { SpentTimeTaskModelComponent } from '../task/spent-time-task-model/spent-time-task-model.component';
import { ToDoChangeStatus } from '@models/to-do-change-status';
import { BookLeaveComponent } from '../../pages/book-leave/book-leave.component';
import { DayOffsAndVacationsService } from '@services/day-offs-and-vacations.service';

@Component({
  selector: 'app-day-events-details-modal',
  templateUrl: './day-events-details-modal.component.html',
  styleUrls: ['./day-events-details-modal.component.scss'],
})
export class DayEventsDetailsModalComponent implements OnInit, OnDestroy {
  taskData: ToDoListData[] = [];
  eventsData: any[] = [];
  vacationData: any[] = [];
  dayOffData: any[] = [];
  hourlyLeaveData: any[] = [];
  workRemotelyData: any[] = [];
  happyBirthdays: any[] = [];
  currentUser: any;
  employee_id?: number;
  refreshCalendar!: boolean;
  leavesData: any = {};
  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dayOffsAndVacationsService: DayOffsAndVacationsService,
    private toDo: ToDoService,
  ) {}
  ngOnDestroy(): void {
    this.dialogRef.close(this.refreshCalendar);
  }

  ngOnInit(): void {
    this.getDayOffs();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.employee_id = this.currentUser.employee_id;
    this.loadTasks();
    for (const item of this.data.events) {
      switch (item.type) {
        case 'Event':
          this.eventsData.push(item);
          break;
        case 'Vacation':
          this.vacationData.push(item);
          break;
        case 'Day Off':
          this.dayOffData.push(item);
          break;
        case 'Work Remotely':
          this.workRemotelyData.push(item);
          break;
        case 'Birthday':
          this.happyBirthdays.push(item);
          break;
        case 'Hourly Leave':
          this.hourlyLeaveData.push(item);
          break;
      }
    }
  }

  private loadTasks(): void {
    this.toDo.getList().subscribe((res) => {
      if (res.success) {
        this.taskData = res.data.filter((task: ToDoListData) =>
          moment(task.due_date).isSame(this.data.day),
        );
        this.taskData.forEach((task: ToDoListData) => {
          if (this.isOldTask(task.due_date) && task.status === 0) {
            task.status = 2;
          }
        });
      }
    });
  }
  isOldTask(date: Date | string): boolean {
    return !moment().isSame(moment(date), 'days') && moment().isAfter(date);
  }

  openUpdateTask(id: number): void {
    const index = this.getTaskIndex(id);
    const config: MatDialogConfig = {
      data: this.taskData[index],
      autoFocus: false,
      width: '540px',
      panelClass: 'custom-MatDialog',
      disableClose: true,
      hasBackdrop: true,
    };

    const dialogRef = this.dialog.open(CreateUpdateTaskComponent, config);
    dialogRef.afterClosed().subscribe((data) => {
      // update locale data
      if (data) {
        this.loadTasks();
        this.refreshCalendar = true;
      }
    });
  }

  deleteTask(id: number): void {
    const index = this.getTaskIndex(id);
    this.toDo.deleteTask(id).subscribe((res) => {
      if (res.success) {
        this.taskData.splice(index, 1);
        this.toastr.success('Task successfully deleted', 'Greate !');
        this.refreshCalendar = true;
      }
    });
  }

  private getTaskIndex(id: number): number {
    return this.taskData.findIndex((task) => task.id === id);
  }

  spentTimeTask(id: number): void {
    const index = this.getTaskIndex(id);
    const status = this.taskData[index].status;

    if (
      moment().isAfter(this.taskData[index].due_date) &&
      !moment().isSame(this.taskData[index].due_date, 'day')
    ) {
      return;
    }
    // open dialog spent time
    if (!status) {
      const config: MatDialogConfig = {
        data: this.taskData[index].id,
        autoFocus: false,
        width: 540 + 'px',
        panelClass: 'custom-MatDialog',
        disableClose: true,
        hasBackdrop: true,
      };
      const dialogRef = this.dialog.open(SpentTimeTaskModelComponent, config);

      dialogRef.afterClosed().subscribe((time) => {
        if (!time) {
          return;
        }
        this.taskData[index].status = 1;
        this.taskData[index].spent_time = time;
        this.toastr.success('spent time  successfully selected', 'Greate !');
      });
    } else {
      const data: ToDoChangeStatus = {
        id: this.taskData[index].id,
        status: 0,
      };
      this.toDo.changeStatusTask(data).subscribe((res) => {
        if (res.success) {
          this.taskData[index].status = 0;
          this.toastr.success('spent time  successfully deselected', 'Greate !');
        }
      });
    }
  }

  openBookLeave(detailId?: number, amountVacation?: number): void {
    const dialogConfig = new MatDialogConfig();
    let dialogRef;

    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-MatDialog';

    if (detailId) {
      this.dayOffsAndVacationsService.getDayOffsDetail(detailId).subscribe((res) => {
        dialogConfig.data = {
          remainingDays: this.leavesData.remainingDays,
          annualLeave: this.leavesData.annualLeave,
          leavesData: res,
          isEditDayOffs: true,
        };
        if (amountVacation) {
          dialogConfig.data.amountVacation = amountVacation;
        }
        dialogRef = this.dialog.open(BookLeaveComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((el) => {
          if (el) {
            this.getDayOffs();
            this.refreshCalendar = true;
          }
        });
      });
    }
  }
  getDayOffs(): void {
    this.dayOffsAndVacationsService.getDayOffs().subscribe((res) => {
      const leavesData = res.data.annual_data;
      this.leavesData = {
        remainingDays: leavesData.total - leavesData.day_offs - leavesData.vacation,
        annualLeave: leavesData.day_offs + leavesData.vacation,
      };
    });
  }
}
