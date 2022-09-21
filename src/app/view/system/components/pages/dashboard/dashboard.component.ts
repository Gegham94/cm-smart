import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as moment from 'moment/moment';
import { ToastrService } from 'ngx-toastr';

import { HeaderService } from '@services/header.service';
import {
  AbsentMembersData,
  EventData,
  ToDoChangeStatus,
  ToDoListData,
} from '../../../../../core/models';
import { CreateUpdateTaskComponent } from '../../dialog/task/create-update-task-model/create-update-task.component';
import { SpentTimeTaskModelComponent } from '../../dialog/task/spent-time-task-model/spent-time-task-model.component';
import { EventsService, ToDoService } from '../../../../../core/services';
import { EventDetailModalComponent } from '../events/event-detail-modal/event-detail-modal.component';
import { CalendarHeaderComponent } from '../../../../../shared/components/calendar-header/calendar-header.component';
import { WeekDay } from '../../../../../core/models/week-day.interface';
import { TaskViewComponent } from '../../dialog/task-view/task-view.component';
import { TaskDialogData } from '../../dialog/task/create-update-task-model/interfaces/task-dialog-data.interface';
import { TaskCreateStep } from '../../../../../shared/enums/task-create-step.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loaderTask = true;
  loaderEvent = true;
  loaderAbsentMembers = true;
  eventList: EventData[] = [];
  selectedTask = false;
  absentMembersData: AbsentMembersData[] = [];
  taskData: ToDoListData[] = [];
  taskDataFiltered: ToDoListData[] = [];
  projectNameData: { [id: number]: string } = {};
  today = new Date();
  rangeTaskFilter: {
    start: Date | null;
    end: Date | null;
  } = {
    start: null,
    end: null,
  };
  minDate = moment().toDate();
  public readonly calendarHeaderComponent = CalendarHeaderComponent;

  public taskFilterOptions = [
    {
      id: 0,
      title: 'All',
      isActive: true,
    },
    {
      id: 1,
      title: 'Done',
      isActive: false,
    },
    {
      id: 2,
      title: 'Fail',
      isActive: false,
    },
  ];

  @ViewChild('picker')
  private readonly todoRangePicker?: MatDateRangePicker<Date>;

  public readonly TaskCreateStep = TaskCreateStep;
  public listOfDays: WeekDay[] = [];
  public activeTodoDate!: Date;

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private toDo: ToDoService,
    private headerService: HeaderService,
    private eventService: EventsService,
  ) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Dashboard');
    this.fetchTasks();
    // for a visible badge with the project name
    this.toDo.getProjects().subscribe((res) => {
      if (res.success) {
        res.data.forEach((value) => {
          this.projectNameData[value.id] = value.title;
        });
      }
    });
    this.loadEvent();
    // load getAbsent Members
    this.toDo.getAbsentMembers().subscribe((res) => {
      if (res.success) {
        this.absentMembersData = res.data;
      }
      this.loaderAbsentMembers = false;
    });

    this.selectToDoWeek({ value: new Date() });
  }

  fetchTasks() {
    this.loaderTask = true;
    // load task data
    this.toDo.getList().subscribe((res) => {
      if (res.success) {
        this.taskData = res.data;
        this.taskDataFiltered = this.resetFilterTasks;
        this.filterTask();
        this.toDo.event$.next();
      }
      this.loaderTask = false;
    });
  }

  loadEvent(): void {
    // load events list
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment().add(1, 'month').format('YYYY-MM-DD');
    this.eventService.getEventList(0, startDate, endDate).subscribe((res) => {
      const nearby: any = res.nearby ? [res.nearby] : [];
      this.eventList = [...res.data, ...nearby].reverse();
      this.loaderEvent = false;
    });
  }

  spentTimeTask(index: number) {
    const status = this.taskDataFiltered[index].status;
    // open dialog spent time
    if (!status) {
      const config: MatDialogConfig = {
        data: this.taskDataFiltered[index].id,
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
        this.taskDataFiltered[index].status = 1;
        this.taskDataFiltered[index].spent_time = time;
        this.toastr.success('spent time  successfully selected', 'Greate !');
        this.toDo.event$.next();
      });
    } else {
      const data: ToDoChangeStatus = {
        id: this.taskDataFiltered[index].id,
        status: 0,
      };
      this.toDo.changeStatusTask(data).subscribe((res) => {
        if (res.success) {
          this.taskDataFiltered[index].status = 0;
          this.toastr.success('spent time  successfully deselected', 'Greate !');
          this.toDo.event$.next();
        }
      });
    }
  }

  openCreateTask() {
    const config: MatDialogConfig = {
      autoFocus: false,
      width: '540px',
      panelClass: 'custom-MatDialog',
      disableClose: true,
      hasBackdrop: true,
    };
    const dialogRef = this.dialog.open(CreateUpdateTaskComponent, config);
    dialogRef.afterClosed().subscribe(() => {
      // update data task list
      this.toDo.getList().subscribe((res) => {
        if (res.success) {
          this.taskData = res.data;
          this.filterTask();
          this.toDo.event$.next();
        }
      });
    });
  }

  openUpdateTask(index: number, step: TaskCreateStep) {
    const config: MatDialogConfig<TaskDialogData> = {
      data: {
        taskToUpdate: this.taskDataFiltered[index],
        updateStep: step,
      },
      autoFocus: false,
      width: '540px',
      panelClass: 'custom-MatDialog',
      disableClose: true,
      hasBackdrop: true,
    };

    const dialogRef = this.dialog.open(CreateUpdateTaskComponent, config);
    dialogRef.afterClosed().subscribe(() => {
      this.fetchTasks();
      this.toDo.event$.next();
    });
  }

  public duplicateTask(index: number): void {
    const taskForDuplicate = this.taskDataFiltered[index];
    this.toDo
      .createTask({
        title: taskForDuplicate.title,
        due_date: taskForDuplicate.due_date,
        planned_time: taskForDuplicate.planned_time,
        project_id: taskForDuplicate.project_id,
      })
      .subscribe((res) => {
        if (res.success) {
          this.toDo.getList().subscribe((res) => {
            if (res.success) {
              this.taskData = res.data;
              this.filterTask();
              this.toastr.success('Task successfully created', 'Greate !');
              this.toDo.event$.next();
            }
          });
        }
      });
  }

  private sortTasks(): ToDoListData[] {
    return this.taskDataFiltered.sort(function (left, right) {
      return moment.utc(left.due_date).diff(moment.utc(right.due_date));
    });
  }

  filterTask() {
    if (!this.rangeTaskFilter.start && !this.rangeTaskFilter.end) {
      this.taskDataFiltered = this.resetFilterTasks;
      this.sortTasks();
      return;
    }

    this.taskDataFiltered = this.taskData.filter((val) => {
      const date = Math.floor(Number(new Date(val.due_date)) / 86400000);
      return date === Math.floor(Number(this.activeTodoDate) / 86400000) && this.willTaskShow(val);
    });

    this.sortTasks();
  }

  private willTaskShow(todo: ToDoListData): boolean {
    let willTaskShow = false;
    const filter = this.taskFilterOptions.find((taskFilter) => taskFilter.isActive);

    if (filter?.id === 0) {
      willTaskShow = true;
    } else if (filter?.id === 1) {
      willTaskShow = todo.status === 1;
    } else if (filter?.id === 2) {
      willTaskShow = this.checkIfFailed(todo);
    }

    return willTaskShow;
  }

  deleteTask(index: number) {
    const id = this.taskDataFiltered[index].id;
    this.toDo.deleteTask(id).subscribe((res) => {
      if (res.success) {
        const taskIndex = this.taskData.findIndex((i) => i.id === id);
        this.taskData.splice(taskIndex, 1);
        this.taskDataFiltered.splice(index, 1);
        this.toastr.success('Task successfully deleted', 'Greate !');
        this.toDo.event$.next();
      }
    });
  }

  public setTaskFilterOption(eent: Event, id: number): void {
    eent.stopPropagation();
    const foundFilter = this.taskFilterOptions.find((filter) => filter.id === id);
    if (foundFilter && foundFilter.isActive === false) {
      this.taskFilterOptions.forEach((filter) => {
        if (filter.isActive) {
          filter.isActive = false;
        }
      });
      foundFilter.isActive = true;

      this.taskFilterOptions = [...this.taskFilterOptions];
      this.filterTask();
    }
  }

  resetFilter() {
    this.rangeTaskFilter = {
      start: null,
      end: null,
    };
    this.taskDataFiltered = this.resetFilterTasks;
    this.sortTasks();
  }

  get resetFilterTasks(): ToDoListData[] {
    return this.taskData.filter((item) => {
      const date = moment(item.due_date);
      return moment().diff(date, 'days') <= 0;
    });
  }

  openPopUpEvent(id: number) {
    const dialogPositions: DialogPosition = {
      top: 0 + 'px',
      right: 0 + 'px',
    };
    const config: MatDialogConfig = {
      disableClose: false,
      autoFocus: true,
      position: dialogPositions,
      width: 461 + 'px',
      height: 100 + 'vh',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'animate__slideInRight',
        'event-detail-modal',
      ],
      data: this.eventList?.find((item) => item.id == id),
      hasBackdrop: true,
    };
    const dialogRef = this.dialog.open(EventDetailModalComponent, config);

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.loaderEvent = true;
        this.loadEvent();
      }
    });
  }

  public selectToDoWeek(event: Partial<MatDatepickerInputEvent<Date>>): void {
    if (event.value?.getDay() === 0) {
      event.value = moment(event.value).add(1, 'day').toDate();
      this.toastr.info('You are not able to select Sunday here. Selected next week.');
    }

    let previousStart!: Date;
    let previousEnd!: Date;

    if (this.rangeTaskFilter.end && this.rangeTaskFilter.start) {
      previousStart = new Date(this.rangeTaskFilter.start);
      previousEnd = new Date(this.rangeTaskFilter.end);
    }

    const selectedDateWeekDay = (event.value as Date).getDay();

    event.value?.setDate(event.value.getDate() - selectedDateWeekDay + 1);
    const startDate = new Date(event.value as Date);

    event.value?.setDate(event.value.getDate() + 5);
    const endDate = new Date(event.value as Date);
    this.rangeTaskFilter.start = startDate;
    this.rangeTaskFilter.end = endDate;

    if (
      !previousStart ||
      !previousEnd ||
      !(
        moment(event.value).isSameOrAfter(previousStart) &&
        moment(event.value).isSameOrBefore(previousEnd)
      )
    ) {
      this.setDaysList();
      this.filterTask();
    }
    this.todoRangePicker?.close();
  }

  public setDaysList(): void {
    const listOfDays: WeekDay[] = [];
    const startDate = new Date(this.rangeTaskFilter.start as Date);
    const endDate = new Date(this.rangeTaskFilter.end as Date);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    for (const d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      listOfDays.push({
        date: new Date(d),
        isActive: moment(d).isSame(this.rangeTaskFilter.start, 'date'),
      });
    }

    this.listOfDays = [...listOfDays];
    const activeDate = listOfDays.find((day) => moment(day.date).isSame(new Date(), 'date'));
    this.setCurrentDay(activeDate ? activeDate : listOfDays[0]);
  }

  public setCurrentDay(day: WeekDay): void {
    day.isActive = true;
    this.activeTodoDate = day.date;
    this.filterTask();
  }

  public setNextDayAsActive(): void {
    this.setCurrentDay(this.listOfDays[this.indexOfDay({ date: this.activeTodoDate }) + 1]);
  }

  public setPreviousDayAsActive(): void {
    this.setCurrentDay(this.listOfDays[this.indexOfDay({ date: this.activeTodoDate }) - 1]);
  }

  public indexOfDay(compareDay: Partial<WeekDay>): number {
    return this.listOfDays.findIndex((day) => day.date.getDay() === compareDay.date?.getDay());
  }

  public checkIfFailed(todo: ToDoListData): boolean {
    return moment().isAfter(todo.due_date, 'day') && todo.status === 0;
  }

  public openTaskView(task: ToDoListData): void {
    const dialogPositions: DialogPosition = {
      top: '0',
      right: '0',
    };

    const config: MatDialogConfig = {
      disableClose: false,
      position: dialogPositions,
      width: '461px',
      height: '100vh',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'animate__slideInRight',
        'event-detail-modal',
        'custom-dialog-container-padding-0',
      ],
      autoFocus: false,
      hasBackdrop: true,
      data: {
        ...task,
        project: task.project_id ? this.projectNameData[task.project_id] : null,
      },
    };
    const dialogRef = this.dialog.open(TaskViewComponent, config);
    dialogRef.afterClosed().subscribe((updatedTask) => {
      task = { ...updatedTask };
      this.loaderTask = true;
      // load task data
      this.toDo.getList().subscribe((res) => {
        if (res.success) {
          this.taskData = res.data;
          this.taskDataFiltered = this.resetFilterTasks;
          this.filterTask();
          this.toDo.event$.next();
        }
        this.loaderTask = false;
      });
    });
  }

  public dropTodoElement(event: CdkDragDrop<ToDoListData[]>): void {
    const previousIndex = this.taskData.findIndex(
      (task) => task.id === this.taskDataFiltered[event.previousIndex].id,
    );
    const currentIndex = this.taskData.findIndex(
      (task) => task.id === this.taskDataFiltered[event.currentIndex].id,
    );

    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    moveItemInArray(this.taskData, previousIndex, currentIndex);
  }

  public customPlannedTime(time: number): string {
    return `${Math.floor(time / 60) ? `${Math.floor(time / 60)} hours` : ''} ${
      Math.floor(time / 60) && time % 60 ? 'and' : ''
    } ${time % 60 ? `${time % 60} minutes` : ''}`;
  }
}
