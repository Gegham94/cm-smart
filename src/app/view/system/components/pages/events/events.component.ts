import { Component, OnInit } from '@angular/core';
import { EventModalComponent } from './create-event-modal/event-modal.component';
import { DialogPosition, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventsService } from '@services/events.service';
import { EventData } from '@models/event-data';
import { HeaderService } from '@services/header.service';
import { EventDetailModalComponent } from './event-detail-modal/event-detail-modal.component';
import 'dayjs/locale/es';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  loader = true;
  isModalOpened = false;
  showEventsDropDown = false;
  rotateEventsArrow = false;
  rotatePickerArrow = false;

  currentUser!: any;
  showDeleteBtn = false;
  selectedEventText = 'All events';
  hidePastEvents = false;
  isNotVisible = false;

  dateChangeStartDateValue!: string;
  dateChangeEndDateValue!: string;

  firstDateOfMonth!: string;
  endDateOfMonth!: string;

  eventIdFromParam!: string;

  eventData!: EventData[];
  nearbyEvent!: EventData;
  upcomingEvents: EventData[] = [];
  pastEvents: EventData[] = [];
  queryParam!: string;
  eventsCount = 0;
  selectedEventStatus = 0;

  rangePicker = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  public teambuildingCount = 0;
  public trainingCount = 0;
  public meetingCount = 0;
  public eventChartCount = 0;
  public pieChartView: [number, number] = [160, 160];
  public pieChart: any = {
    colorScheme: {
      domain: ['#EF988F', '#83B7AD', '#F9B04D', '#92BEFA'],
    },
    legend: ['asdasdasd'],
    single: [
      {
        name: 'Events',
        value: 0,
      },
      {
        name: 'Teambuilding',
        value: 0,
      },
      {
        name: 'Meeting',
        value: 0,
      },
      {
        name: 'Trainings',
        value: 0,
      },
    ],
  };

  constructor(
    private dialog: MatDialog,
    private eventService: EventsService,
    private headerService: HeaderService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private location: Location,
  ) {}

  openModal(): void {
    this.openEventModal();
    this.isModalOpened = true;
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.headerService.setHeaderValue('Events');
    this.firstDateOfMonth = moment().add(-1, 'month').format('YYYY-MM-DD');
    this.endDateOfMonth = moment().add(1, 'month').format('YYYY-MM-DD');
    this.activeRoute.queryParams.subscribe((params) => {
      if (Object.keys(params).length === 0 && !params.end) {
        this.fetch(0);
        return;
      }
      if (params.end) {
        this.rangePicker.controls.start.setValue(params.start);
        this.rangePicker.controls.end.setValue(params.end);
        this.showDeleteBtn = true;
        this.fetch(0, params.start, params.end);
        this.dateChangeStartDateValue = params.start;
        this.dateChangeEndDateValue = params.end;
        this.queryParam = `start=${params.start}&end=${params.end}`;
        return;
      }
      if (params.eventId && !params.end) {
        this.eventIdFromParam = params.eventId;
        this.fetch(0, this.firstDateOfMonth, this.endDateOfMonth);
        return;
      }
    });
  }

  openEventModal(data?: object): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.panelClass = ['event-create-modal'];
    const dialogRef = this.dialog.open(EventModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((closedData: string) => {
      this.isModalOpened = false;
      if (closedData) {
        if (this.showDeleteBtn) {
          this.fetch(
            this.selectedEventStatus,
            this.dateChangeStartDateValue,
            this.dateChangeEndDateValue,
          );
        } else {
          this.fetch(this.selectedEventStatus);
        }
      }
    });
  }

  openAllEvents(): void {
    this.rotateEventsArrow = true;
    this.showEventsDropDown = !this.showEventsDropDown;
    this.showEventsDropDown ? (this.rotateEventsArrow = true) : (this.rotateEventsArrow = false);
  }
  autoCloseForEventDropDown(event: any): void {
    this.showEventsDropDown = true;
    this.rotateEventsArrow = true;
    const target = event.target;
    if (this.showEventsDropDown) {
      if (!target.closest('.dropdown-menu')) {
        this.showEventsDropDown = false;
        this.rotateEventsArrow = false;
        return;
      }
    }
  }

  clickedCalendar(): void {
    this.rotatePickerArrow = true;
  }
  onClose(): void {
    this.rotatePickerArrow = false;
  }

  startDateChange(event: any): void {
    this.dateChangeStartDateValue = moment(event.value).format('YYYY-MM-DD');
  }
  endDateChange(event: any): void {
    this.showDeleteBtn = true;
    this.dateChangeEndDateValue = moment(event.value).format('YYYY-MM-DD');
    if (this.selectedEventStatus === 1) {
      this.fetch(1, this.dateChangeStartDateValue, this.dateChangeEndDateValue);
    } else {
      this.fetch(0, this.dateChangeStartDateValue, this.dateChangeEndDateValue);
    }
    this.queryParam = `start=${this.dateChangeStartDateValue}&end=${this.dateChangeEndDateValue}`;
    this.location.replaceState('/system/events', this.queryParam);
  }

  deleteFilters(): void {
    this.showDeleteBtn = false;
    this.rangePicker.reset();
    this.selectedEventStatus === 1 ? this.fetch(1) : this.fetch(0);
    this.queryParam = '';
    this.location.replaceState('/system/events');
  }

  openEventDetailsModal(event: any): void {
    const dialogConfig = new MatDialogConfig();
    const dialogPositions: DialogPosition = {
      top: 0 + 'px',
      right: 0 + 'px',
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.position = dialogPositions;
    dialogConfig.width = 461 + 'px';
    dialogConfig.height = 100 + 'vh';
    dialogConfig.panelClass = [
      'animate__animated',
      'animate__slideInRight',
      'animate__slideInRight',
      'event-detail-modal',
    ];
    dialogConfig.disableClose = false;
    dialogConfig.data = event;
    this.queryParam = `eventId=${event.id}`;
    this.location.replaceState('/system/events', this.queryParam);
    const dialogRef = this.dialog.open(EventDetailModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.showDeleteBtn) {
          this.fetch(
            this.selectedEventStatus,
            this.dateChangeStartDateValue,
            this.dateChangeEndDateValue,
          );
        } else {
          this.fetch(this.selectedEventStatus);
        }
      }
      this.location.replaceState('/system/events');
    });
  }
  hoveredBlock(el: any): void {
    const bounding = el.target.getBoundingClientRect();
    el.target.classList.add('is-not-visibility');
    if (window.innerHeight - (bounding.y + 280) < 0) {
      el.target.classList.add('is-not-visibility');
    } else {
      el.target.classList.remove('is-not-visibility');
    }
  }
  openEventEditModal(data: any): void {
    this.openEventModal(data);
  }
  hovered(event: any): void {
    const bounding = event.getBoundingClientRect();
    if (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= window.innerWidth) {
      this.isNotVisible = false;
    } else {
      this.isNotVisible = true;
    }
  }
  left(): void {
    this.isNotVisible = false;
  }

  countAnumberOfEmployyes(team: EventData[]): void {
    for (const empCount of team) {
      empCount.total = 0;
      for (const arr of empCount.participants) {
        arr.team === 'Frontend Development' ? (empCount.total += arr.employees.length) : 0;
        arr.team === 'Backend Development' ? (empCount.total += arr.employees.length) : 0;
        arr.team === 'Management' ? (empCount.total += arr.employees.length) : 0;
        arr.team === 'Mobile Team' ? (empCount.total += arr.employees.length) : 0;
        arr.team === 'Design Team' ? (empCount.total += arr.employees.length) : 0;
        arr.team === 'Team Leads' ? (empCount.total += arr.employees.length) : 0;
      }
    }
    if (this.nearbyEvent !== null) {
      this.nearbyEvent.total = 0;
      for (const arr of this.nearbyEvent.participants) {
        arr.team === 'Frontend Development' ? (this.nearbyEvent.total += arr.employees.length) : 0;
        arr.team === 'Backend Development' ? (this.nearbyEvent.total += arr.employees.length) : 0;
        arr.team === 'Management' ? (this.nearbyEvent.total += arr.employees.length) : 0;
        arr.team === 'Mobile Team' ? (this.nearbyEvent.total += arr.employees.length) : 0;
        arr.team === 'Design Team' ? (this.nearbyEvent.total += arr.employees.length) : 0;
        arr.team === 'Team Leads' ? (this.nearbyEvent.total += arr.employees.length) : 0;
      }
    }
  }

  fetch(whoseEvent?: number, startDate?: string, endDate?: string): void {
    const start = moment(startDate).format('YYYY-MM-DD');
    const end = moment(endDate).format('YYYY-MM-DD');
    startDate = startDate ? start : this.firstDateOfMonth;
    endDate = endDate ? end : this.endDateOfMonth;
    endDate = moment(endDate).add(1, 'day').format('YYYY-MM-DD');
    whoseEvent === 1 ? (whoseEvent = 1) : (whoseEvent = 0);
    this.loader = true;
    this.eventService.getEventList(whoseEvent, startDate, endDate).subscribe((event) => {
      this.eventsCount = 0;
      this.pastEvents = [];
      this.upcomingEvents = [];
      this.nearbyEvent = event.nearby;
      for (let i = event.data.length - 1; i >= 0; i--) {
        const events = event.data[i];

        // past events
        if (moment(events.start_date).isBefore(moment(), 'day')) {
          this.pastEvents.push(events);
        }
        // end past events

        // upcoming events
        else if (
          moment(events.start_date).isAfter(moment(), 'day') ||
          moment().diff(events.start_date, 'day') == 0
        ) {
          this.upcomingEvents.push(events);
        }
        // end upcoming events
      }
      this.eventsCount =
        this.pastEvents.length + this.upcomingEvents.length + (this.nearbyEvent ? 1 : 0);
      this.countAnumberOfEmployyes(this.upcomingEvents);
      this.countAnumberOfEmployyes(this.pastEvents);
      this.eventData = event.data;
      if (this.eventIdFromParam) {
        for (const events of this.eventData) {
          if (events.id === +this.eventIdFromParam) {
            this.openEventDetailsModal(events);
          }
        }
      }
      this.setChartData();
      this.loader = false;
    });
  }

  private setChartData(): void {
    this.teambuildingCount = 0;
    this.eventChartCount = 0;
    this.meetingCount = 0;
    this.trainingCount = 0;

    [...this.eventData, this.nearbyEvent].forEach((event) => {
      switch (event.type) {
        case 1:
          this.pieChart.single.find(
            (dataEl: { name: string; value: number }) => dataEl.name === 'Teambuilding',
          ).value += 1;
          this.teambuildingCount += 1;
          break;
        case 2:
          this.pieChart.single.find(
            (dataEl: { name: string; value: number }) => dataEl.name === 'Event',
          ).value += 1;
          this.eventChartCount += 1;
          break;
        case 3:
          this.pieChart.single.find(
            (dataEl: { name: string; value: number }) => dataEl.name === 'Meeting',
          ).value += 1;
          this.meetingCount += 1;
          break;
        case 4:
          this.pieChart.single.find(
            (dataEl: { name: string; value: number }) => dataEl.name === 'Trainings',
          ).value += 1;
          this.trainingCount += 1;
          break;
      }
    });
  }

  selectWhoseEvent(status: number, eventType: string): void {
    this.selectedEventText = eventType;
    this.selectedEventStatus = status;
    this.showEventsDropDown = false;
    this.rotateEventsArrow = false;
    this.queryParam === undefined || this.queryParam === ''
      ? this.fetch(status)
      : this.fetch(status, this.dateChangeStartDateValue, this.dateChangeEndDateValue);
  }
}
