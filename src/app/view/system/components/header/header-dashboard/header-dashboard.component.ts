import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { chartData } from '../../pages/about/about-chart-data';
import { DayOffsAndVacationsService, ToDoService } from '../../../../../core/services';
import * as moment from 'moment/moment';
import { ToDoListData } from '../../../../../core/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.scss'],
})
export class HeaderDashboardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() taskData: ToDoListData[] = [];
  projectView: any = [92, 50];
  progressTaskView: any;

  taskFailChart: any = {
    chartData,
    colorScheme: {
      domain: ['#EF988F'],
    },
    count: 0,
    single: [],
  };
  taskDoneChart: any = {
    chartData,
    colorScheme: {
      domain: ['#83B7AD'],
    },
    count: 0,
    single: [],
  };

  userNameSurname!: string;
  email?: string;
  upcomingLeaveDate?: Date;
  private event$!: Subscription;

  constructor(private toDo: ToDoService, private dayOffsService: DayOffsAndVacationsService) {}

  ngOnDestroy(): void {
    this.event$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskData) {
      this.taskWeek();
    }
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
    this.email = currentUser.email;
    this.userNameSurname = currentUser.first_name + ' ' + currentUser.last_name;
    this.loadDayOffs();
    this.event$ = this.toDo.event$.subscribe(() => {
      this.taskWeek();
    });
    this.taskWeek();
  }

  loadDayOffs(): void {
    this.dayOffsService.getDayOffs().subscribe((res) => {
      if (res.success) {
        const upcomingLeave = [...res.data.leaves, ...res.data.vacations];

        upcomingLeave.sort((a, b) => {
          return moment(a.start_date).isAfter(b.start_date) ? -1 : 1;
        });
        for (const upcomingLeaveElement of upcomingLeave) {
          if (
            !(upcomingLeaveElement.type === 'Day Off' || upcomingLeaveElement.type === 'Vacation')
          ) {
            continue;
          }
          const startDate = moment(upcomingLeaveElement.start_date, 'DD/MM/YYYY');
          if (moment().isBefore(startDate) || moment().isSame(startDate, 'day')) {
            this.upcomingLeaveDate = moment(startDate).toDate();
            break;
          }
        }
      }
    });
  }

  taskWeek(): void {
    const weekIndex: any = {};
    const startDate = moment().add(-6, 'day');
    const day = startDate.clone();
    this.taskFailChart.single = [];
    this.taskDoneChart.single = [];
    this.taskDoneChart.count = 0;
    this.taskFailChart.count = 0;

    // set default chart
    for (let i = 0; i < 7; i++) {
      weekIndex[day.day()] = i;
      const dayName = day.format('dddd');
      this.taskFailChart.single.push({ name: dayName, value: 0.1 });
      this.taskDoneChart.single.push({ name: dayName, value: 0.1 });
      day.add(1, 'day');
    }
    this.taskFailChart.single[this.taskFailChart.single.length - 1].value = 0;
    for (const task of this.taskData) {
      const dayIndex = weekIndex[moment(task.due_date).day()];
      if (
        (startDate.isBefore(task.due_date, 'day') && moment().isAfter(task.due_date, 'day')) ||
        startDate.isSame(task.due_date, 'day')
      ) {
        if (task.status === 0 || task.status === 2) {
          this.taskFailChart.count++;
          this.taskFailChart.single[dayIndex].value++;
        } else if (task.status === 1) {
          this.taskDoneChart.count++;
          this.taskDoneChart.single[dayIndex].value++;
        }
      } else if (moment().isSame(task.due_date, 'day') && task.status === 1) {
        this.taskDoneChart.count++;
        this.taskDoneChart.single[dayIndex].value++;
      }
    }
  }
}
