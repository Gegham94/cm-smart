import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { CalendarService } from '@services/calendar.service';
import * as moment from 'moment';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Leaves } from '@models/leaves';
import { Vacations } from '@models/vacations';
import { Annual } from '@models/annual';
import { DayOffsAndVacationsService } from '@services/day-offs-and-vacations.service';
import { BookLeaveComponent } from '../book-leave/book-leave.component';
import { HeaderService } from '@services/header.service';
import { Router } from '@angular/router';
import { EventDetailModalComponent } from '../events/event-detail-modal/event-detail-modal.component';
import { Subject } from 'rxjs';
import { DayEventsDetailsModalComponent } from '../../dialog/day-events-details-modal/day-events-details-modal.component';
import { ToDoListData } from '@models/to-do-list-data';
import { ToDoService } from '@services/to-do.service';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss'],
})
export class FullCalendarComponent implements OnInit, OnDestroy {
  isMyLeave = false;
  vacationCount = 0;
  private colors: any = {
    event: {
      0: {
        primary: '#F4C584',
        secondary: '#F4C584',
      },
      1: {
        primary: '#83B7AD',
        secondary: '#83B7AD',
      },
      2: {
        primary: '#EF988F',
        secondary: '#EF988F',
      },
      3: {
        primary: '#92BEFA',
        secondary: '#92BEFA',
      },
    },
    holiday: {
      primary: '#f08175',
      secondary: '#f08175',
    },
    vacation: {
      index: 0,
    },
  };
  taskData: ToDoListData[] = [];
  private colorIndex = 0;
  loader = true;
  loaderTask = true;
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  eventObject: any = {};
  viewDate: Date = new Date();
  calendarEvents: any[] = [];
  dayOffsArray: any[] = [];
  dayOffsObject: any = {};
  vacations: any[] = [];
  holidays: any[] = [];
  projectNameData: { [id: number]: string } = {};
  showLeaveBlock = false;
  leavesData!: Leaves[];
  leavesTable!: Leaves[];
  leavesDataSource!: Leaves[];
  vacationsDataSrource!: Vacations[];
  annualData!: Annual;
  vacationsModel!: Vacations[];
  scrollClassVacation = false;
  scrollClassDayOff = false;
  annualTotal!: number;
  annualVacation!: number;
  annualDayOffs!: number;
  annualHoursLeave!: number;
  remainingDays!: number;
  isDataGetted = false;
  currentYear = moment().year();
  events: any[] = [];
  activeDayIsOpen = false;
  moreVacationData: any = {};
  public moment: any = moment;
  refresh = new Subject<void>();
  currentUser!: any;

  constructor(
    private modal: NgbModal,
    private calendar: CalendarService,
    private dayOffsAndVacationsService: DayOffsAndVacationsService,
    public dialog: MatDialog,
    private headerService: HeaderService,
    private router: Router,
    private toDo: ToDoService,
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.headerService.setHeaderValue('Calendar');
    this.getCalendar();
    this.getDayOffs();
    this.loadProjects();
    this.loadTasks();
  }
  ngOnDestroy(): void {
    this.refresh.complete();
  }

  getCalendar(year = this.currentYear, myLeave = this.isMyLeave): void {
    this.calendar.getCalendar(String(year)).subscribe((event) => {
      const vacationList: any = {};
      Object.values(event.data).forEach((i: any) => {
        i.forEach((event: any) => {
          if (myLeave && event.employee_id !== this.currentUser.employee_id) {
            return;
          }
          if (event.type === 'Vacation') {
            const id = event.employee_id;
            const date = moment(event.from).format('YYYY-MM-DD');
            if (!vacationList.hasOwnProperty(id)) {
              vacationList[id] = {};
            }
            vacationList[id][date] = event;
          } else {
            this.calendarEvents.push(event);
          }
        });
      });
      for (const id in vacationList) {
        for (const date in vacationList[id]) {
          this.calendarEvents.push(vacationList[id][date]);
        }
      }
      this.addEventsIntoCalendar();
      this.moreVacation();
      this.loader = false;
    });
  }
  private resetFields(): void {
    this.calendarEvents = [];
    this.events = [];
    this.vacations = [];
    this.dayOffsArray = [];
    this.holidays = [];
    this.dayOffsObject = {};
    this.eventObject = {};
    this.moreVacationData = {};
  }
  addEventsIntoCalendar(): void {
    let eventObj: any;

    for (const events of this.calendarEvents) {
      if (events.type === 'Event') {
        eventObj = {
          id: events.id,
          start: new Date(events.from),
          to: new Date(events.to),
          end: new Date(events.to),
          title: events.description.split(' in Meeting ')[0],
          room: events.description.split(' in Meeting ')[1],
          time: `${moment(events.from).format('HH:mm')} - ${moment(events.to).format('HH:mm')}`,
          color: this.getColor(),
          type: events.type,
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
        };
        this.events.push(eventObj);
      } else if (events.type === 'Vacation') {
        eventObj = {
          title: `${events.employee_name} | Vacation | ${moment(events.from).format(
            'MM-DD',
          )} - ${moment(events.to).format('MM-DD')}`,
          color: this.getColor(events.employee_id),
          start: new Date(events.from),
          amount: events.amount,
          end: new Date(events.to),
          allDay: true,
        };
        this.vacations.push({ ...events, ...eventObj });
      } else if (
        events.type === 'Day Off' ||
        events.type === 'Work Remotely' ||
        events.type === 'Birthday' ||
        events.type === 'Hourly Leave'
      ) {
        eventObj = {
          title:
            events.employee_name +
            ' | ' +
            events.type +
            (events.type === 'Hourly Leave'
              ? ` ${moment(events.from).format('HH:mm')} - ${moment(events.to).format('HH:mm')}`
              : ''),
          color: this.getColor(events.employee_id),
          start: new Date(events.from ? events.from : events.date),
          allDay: true,
        };
        this.dayOffsArray.push({ ...events, ...eventObj });
      } else if (events.type === 'Holiday') {
        eventObj = {
          title: `Holiday | ${events.description}`,
          color: this.colors.holiday,
          start: new Date(events.date),
          allDay: true,
        };
        this.holidays.push({ ...events, ...eventObj });
      }
    }

    this.vacations.sort((a, b) => {
      return moment(a.to).isAfter(b.to) ? -1 : 1;
    });

    this.dayOffsArray.forEach((el) => {
      if (this.dayOffsObject.hasOwnProperty(`${new Date(el.date)}`)) {
        this.dayOffsObject[`${new Date(el.date)}`].push(el);
      } else {
        this.dayOffsObject[`${new Date(el.date)}`] = [];
        this.dayOffsObject[`${new Date(el.date)}`].push(el);
      }
    });
    this.events.forEach((event) => {
      const date = new Date(event.start);
      date.setHours(0, 0, 0, 0);
      if (this.eventObject.hasOwnProperty(`${date}`)) {
        this.eventObject[`${date}`].push(event);
      } else {
        this.eventObject[`${date}`] = [];
        this.eventObject[`${date}`].push(event);
      }
    });
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  mouseEnter(event: any, $event?: any): void {
    const a = event.classList;
    a.add('active');
    const rect = event.getBoundingClientRect();
    const win = {
      height: window.innerHeight || document.documentElement.clientHeight,
    };
    if (win.height - (rect.y + rect.height) - 30 < 0) {
      a.add('not-visible');
    }
    if ($event) {
      const newX =
        $event.clientX + 220 > window.innerWidth
          ? window.innerWidth - ($event.clientX - $event.layerX) - 220
          : $event.layerX;
      event.style.left = `${newX - 40}px`;
    }
  }

  mouseLeave(event: any): void {
    this.showLeaveBlock = true;
    const a = event.classList;
    a.remove('active');
    a.remove('not-visible');
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent | any): void {
    for (const holidays of this.holidays) {
      renderEvent.body.forEach((calendarDays: any) => {
        if (
          moment(calendarDays.date).format('YYYY-MM-DD') ===
          moment(holidays.date).format('YYYY-MM-DD')
        ) {
          calendarDays.cssClass = 'bg-pink';
        }
      });
    }
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    renderEvent.hourColumns.forEach((hourColumn) => {
      hourColumn.hours.forEach((hour) => {
        hour.segments.forEach((segment) => {
          this.holidays.forEach((holdays) => {
            if (moment(segment.date).format('YYYY-MM-DD') === holdays.date) {
            }
          });
        });
      });
    });
  }
  loadProjects(): void {
    this.toDo.getProjects().subscribe((res) => {
      if (res.success) {
        res.data.forEach((value, _) => {
          this.projectNameData[value.id] = value.title;
        });
      }
    });
  }
  openPopUpEvent(id: number): void {
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
      data: id,
      hasBackdrop: true,
    };
    this.dialog.open(EventDetailModalComponent, config);
  }
  openBookLeave(): void {
    const config = {
      autoFocus: true,
      panelClass: 'custom-MatDialog',
      disableClose: false,
      hasBackdrop: true,
      data: {
        remainingDays: this.remainingDays,
        annualLeave: this.annualDayOffs + this.annualVacation,
        leavesData: this.leavesData,
        isEditDayOffs: false,
      },
    };

    const dialogRef = this.dialog.open(BookLeaveComponent, config);

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.refreshCalendar();
    });
  }
  private refreshCalendar(): void {
    this.resetFields();
    this.getDayOffs();
    this.getCalendar();
    this.loadTasks();
    this.refresh.next();
    this.loader = true;
    this.loaderTask = true;
  }
  getDayOffs(): void {
    this.dayOffsAndVacationsService.getDayOffs().subscribe((res) => {
      this.leavesData = res.data.leaves;
      this.vacationsModel = res.data.vacations;
      this.leavesTable = this.leavesData;
      this.leavesDataSource = this.leavesTable;
      this.annualData = res.data.annual_data;
      this.annualTotal = this.annualData.total;
      this.annualVacation = this.annualData.vacation;
      this.annualDayOffs = this.annualData.day_offs;
      this.annualHoursLeave = this.annualData.hours_leave;
      this.remainingDays = this.annualTotal - this.annualDayOffs - this.annualVacation;
      this.vacationsDataSrource = this.vacationsModel;
      this.vacationsModel.length > 5
        ? (this.scrollClassVacation = true)
        : (this.scrollClassVacation = false);
      this.leavesData.length > 5
        ? (this.scrollClassDayOff = true)
        : (this.scrollClassDayOff = false);
      this.isDataGetted = true;
    });
  }

  redirectToDayOff(): void {
    this.router.navigate(['/system/day-offs-and-vacation']);
  }
  toggleOnlyMyLeave(): void {
    this.isMyLeave = !this.isMyLeave;
    this.resetFields();
    this.getCalendar();
    this.refresh.next();
    this.loader = true;
  }
  private getColor(employee_id: number = 0): any {
    if (employee_id) {
      // get color by employee_id
      if (!this.colors.vacation.hasOwnProperty(employee_id)) {
        this.colors.vacation.index =
          Object.keys(this.colors.event).length === this.colors.vacation.index
            ? 0
            : this.colors.vacation.index;
        this.colors.vacation[employee_id] = this.colors.event[this.colors.vacation.index++];
      }
      return this.colors.vacation[employee_id];
    }
    this.colorIndex =
      Object.keys(this.colors.event).length === this.colorIndex ? 0 : this.colorIndex;
    return this.colors.event[this.colorIndex++];
  }

  getVacationLength(start: any, end: any): number {
    start = moment(start).startOf('day');
    end = moment(end).startOf('day');
    const day = start.day();
    const maxLengthDay = 6 - day;
    const diff = Math.ceil(moment.duration(start.diff(end)).abs().asDays());
    diff - maxLengthDay > 0;
    return (diff > maxLengthDay ? maxLengthDay : diff) + 1;
  }
  isVacationLineBreak(start: any, end: any): string {
    let isStart = false;
    let isEnd = false;
    let cls = '';
    start = moment(start);
    end = moment(end);
    const day = start.day();
    const maxLengthDay = 6 - day;
    const diff = Math.ceil(moment.duration(start.diff(end)).abs().asDays());
    if (day === 0 && !start.isSame(end.from)) {
      isStart = true;
      cls += 'start ';
    }
    if (diff - maxLengthDay > 0) {
      isEnd = true;
      cls += 'end ';
    }
    cls += day === 0 && !start.isSame(end.from) ? 'start ' : '';
    cls += diff - maxLengthDay > 0 ? 'end ' : '';
    return isStart && isEnd ? 'none' : cls;
  }
  getCount(reset: boolean = false) {
    if (reset) {
      this.vacationCount = 0;
      return;
    }
    this.vacationCount++;
  }
  getEventsByName(events: any, name: string): any[] {
    const res: any = [];
    for (const event of events) {
      if (event.type === name) {
        res.push(event);
      }
    }
    return res;
  }
  getVacation(events: any): any[] {
    return this.getEventsByName(events, 'Vacation');
  }
  private moreVacation(): void {
    for (const vacation of this.vacations) {
      const fromWeek = moment(vacation.from).week();
      const toWeek = moment(vacation.to).week();
      for (let i = fromWeek; i <= toWeek; i++) {
        if (!this.moreVacationData.hasOwnProperty(i)) {
          this.moreVacationData[i] = [];
        }
        this.moreVacationData[i].push(vacation);
      }
    }
    for (const key in this.moreVacationData) {
      this.moreVacationData[key].sort((a: any, b: any) => {
        return moment(a.to).isAfter(b.to) ? 1 : -1;
      });
    }
  }
  getMoreVacation(date: any): any {
    const res = {
      start: '',
      end: '',
      data: [],
    };
    date = moment(date.date);
    const week = date.week();
    if (this.moreVacationData.hasOwnProperty(week)) {
      const lenWeek = this.moreVacationData[week].length;
      if (this.moreVacationData[week].length >= 3) {
        const start = moment(this.moreVacationData[week][2].from);
        const end = moment(this.moreVacationData[week][lenWeek - 1].to);
        res.start = start.format('YYYY-MM-DD');
        res.end = end.format('YYYY-MM-DD');
        res.data = this.moreVacationData[week];
        res.data = res.data.filter((current: any) => start.isBefore(current.end));
      }
    }
    return res;
  }
  openPopUpDayEvents(day: any): void {
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
        'dialog-padding-none',
      ],
      data: {
        day: day.date,
        events: day.events,
        projects: this.projectNameData,
      },
      hasBackdrop: true,
    };
    const dialogRef = this.dialog.open(DayEventsDetailsModalComponent, config);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.refreshCalendar();
      }
    });
  }
  private loadTasks(): void {
    this.toDo.getList().subscribe((res) => {
      if (res.success) {
        this.taskData = res.data;
        this.loaderTask = false;
      }
    });
  }
  isHaveTaskByDate(date: string): boolean {
    return !!this.taskData.find((task: ToDoListData) => moment(task.due_date).isSame(date, 'day'));
  }

  weekDayClick($event: any): void {
    const event = {
      dayOffs: this.dayOffsArray.filter((item) => {
        return moment($event.day.date).isSame(item.start, 'day');
      }),
      events: this.events.filter((item) => {
        return moment($event.day.date).isSame(item.start, 'day');
      }),
      vacations: this.vacations.filter((item) => {
        return (
          (moment($event.day.date).isAfter(item.from, 'day') &&
            moment($event.day.date).isBefore(item.to, 'day')) ||
          moment($event.day.date).isSame(item.from, 'day') ||
          moment($event.day.date).isSame(item.to, 'day')
        );
      }),
    };
    const data = {
      date: $event.day.date,
      events: [...event.dayOffs, ...event.events, ...event.vacations],
    };
    this.openPopUpDayEvents(data);
  }
}
