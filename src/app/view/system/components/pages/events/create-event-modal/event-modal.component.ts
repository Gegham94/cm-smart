import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DurationButtons } from '@models/duration-buttons';
import { EventTypeButtons } from '@models/event-type-buttons';
import { EventData } from '@models/event-data';
import { Room } from '@models/room';
import { EmployeeService } from '@services/employee.service';
import { UploadService } from '@services/upload.service';
import { ToastrService } from 'ngx-toastr';
import { EmployeeData } from '@models/employee-data';
import { BackendDevelopment } from '@models/backend-development';

import * as moment from 'moment';
import { EventsService } from '@services/events.service';
import { EmployeeType } from '@models/employee-type';
import { Time } from '@models/time';
import { ParticipantsData } from '@models/participants-data';
import { Subscription } from 'rxjs';
import { HolidaysService } from '@services/holidays.service';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { HolidaysData } from '@models/holidays-data';

@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit, OnDestroy {
  isShowWarningMessageDuplicateEvent = false;
  employeeData!: EmployeeData;
  participants: number[] = [];
  backendDevelopment!: BackendDevelopment[];
  selectType = 1;
  fileUrl?: any;
  auto: any;
  isUpdate = false;
  currentUser!: any;
  meetingType = 'Teambuilding';
  location!: string;
  locationValue = 'Gyumri,Alek Manukyan 1';
  date!: string;
  allEmployers: EmployeeType[] = [];
  participantsData: ParticipantsData[] = [];
  timeValue!: string;
  selectedObjectsFromArray: any[] = [];
  roomModel: any;
  currentOrganizer: any;
  startTimeModel: any;
  startPicker: any;
  date1: any;
  startTime!: any;
  endTime!: any;
  durationTime: any;
  minDate = moment().toDate();
  durationButtons: DurationButtons[] = [
    { id: 1, title: '15 Minute', selected: false, disable: false, value: 15 },
    { id: 2, title: '30 Minute', selected: false, disable: false, value: 30 },
    { id: 3, title: '1 Hour', selected: false, disable: false, value: 60 },
    { id: 4, title: '2 Hours', selected: false, disable: false, value: 120 },
    { id: 5, title: '3 Hours', selected: false, disable: false, value: 180 },
    { id: 6, title: 'Half day', selected: false, disable: false, value: 240 },
    { id: 7, title: 'Full day', selected: false, disable: false, value: 480 },
  ];
  eventTypeButtons: EventTypeButtons[] = [
    { id: 1, event_type: 'Teambuilding', selected: true },
    { id: 2, event_type: 'Events', selected: false },
    { id: 3, event_type: 'Meeting/Descussion', selected: false },
    { id: 4, event_type: 'Trainings', selected: false },
  ];
  eventForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      this.noWhitespaceValidator,
      Validators.maxLength(255),
    ]),
    organizer_id: new FormControl('', [Validators.required]),
    participants: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    place: new FormControl('Gyumri,Alek Manukyan 1'),
    description: new FormControl('', [Validators.required]),
    type: new FormControl(this.selectType, [Validators.required]),
    date: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    room: new FormControl('', [Validators.required]),
    photo: new FormControl(''),
  });
  observeControlsTime?: Subscription;
  isErrorMessageImageUpload = false;
  eventTime!: string;
  rooms: Room[] = [
    { id: 1, title: 'Meeting Room' },
    { id: 2, title: 'Meeting Room1' },
  ];
  selectedTime!: string;
  startTimeList: Time[] = [
    { id: 1, title: '09:00' },
    { id: 2, title: '09:15' },
    { id: 3, title: '09:30' },
    { id: 4, title: '09:45' },
    { id: 5, title: '10:00' },
    { id: 6, title: '10:15' },
    { id: 7, title: '10:30' },
    { id: 8, title: '10:45' },
    { id: 9, title: '11:00' },
    { id: 10, title: '11:15' },
    { id: 11, title: '11:30' },
    { id: 12, title: '11:45' },
    { id: 13, title: '12:00' },
    { id: 14, title: '12:15' },
    { id: 15, title: '12:30' },
    { id: 16, title: '12:45' },
    { id: 17, title: '13:00' },
    { id: 18, title: '13:15' },
    { id: 19, title: '13:30' },
    { id: 20, title: '13:45' },
    { id: 21, title: '14:00' },
    { id: 22, title: '14:15' },
    { id: 23, title: '14:30' },
    { id: 24, title: '14:45' },
    { id: 25, title: '15:00' },
    { id: 26, title: '15:15' },
    { id: 27, title: '15:30' },
    { id: 28, title: '15:45' },
    { id: 29, title: '16:00' },
    { id: 30, title: '16:15' },
    { id: 31, title: '16:30' },
    { id: 32, title: '16:45' },
    { id: 33, title: '17:00' },
    { id: 34, title: '17:15' },
    { id: 35, title: '17:30' },
    { id: 36, title: '17:45' },
    { id: 37, title: '18:00' },
    { id: 38, title: '18:15' },
    { id: 39, title: '18:30' },
    { id: 40, title: '18:45' },
    { id: 41, title: '19:00' },
  ];
  isOldLeave = false;
  holidays: { [name: string]: HolidaysData } = {};
  holidaysList: HolidaysData[] = [];
  constructor(
    public dialogRef: MatDialogRef<MatDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EventData,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private eventService: EventsService,
    private holidaysService: HolidaysService,
    private uploadService: UploadService,
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentOrganizer = this.currentUser.employee_id;
    this.getEmployee();
    if (this.data) {
      for (const arr of this.data.participants) {
        for (const emp of arr.employees) {
          this.selectedObjectsFromArray.push(emp.employee_id);
        }
      }
      this.location = this.data.place;
      this.date = this.data.date;
      this.isUpdate = true;
      const tempData = Object.assign({}, this.data);
      tempData.photo = tempData.photo.replace('/uploads/', ''); // replace prefix upload
      this.fileUrl =
        tempData.photo === '' ? '' : `https://manage-company.app/uploads/${tempData.photo}`;
      this.eventForm.patchValue(tempData);
      this.eventTime = this.data.time;
      this.roomModel = this.data.room;
      this.currentOrganizer = this.data.organizer.id;
      this.selectedTime = this.data.start_date.split(' ')[1].slice(0, 5);
      this.eventForm.controls.time.setValue(this.selectedTime);
      this.date1 = new FormControl(new Date(this.data.start_date));
      this.eventForm.controls.date = this.date1;
      this.date = this.data.start_date;
      for (const arr of this.eventTypeButtons) {
        arr.selected = false;
        if (arr.id === this.data.type) {
          this.meetingType = arr.event_type;
          arr.selected = true;
        }
      }

      this.startTime = this.convertToMin(this.data.start_date.split(' ')[1].slice(0, 5));
      this.endTime = this.convertToMin(this.data.end_date.split(' ')[1].slice(0, 5));
      this.durationTime = this.endTime - this.startTime;
      for (const arr of this.durationButtons) {
        if (this.durationTime === arr.value) {
          this.eventForm.controls.duration.setValue(arr.value);
          arr.selected = true;
        }
      }
      this.checkOldLeave();
    }
    this.observeControlsTime = this.eventForm?.get('time')?.valueChanges.subscribe((val) => {
      this.changeStartTime(val);
      if (480 === this.eventForm.controls.duration.value && this.durationButtons[6].disable) {
        setTimeout(() => {
          this.eventForm.controls.duration.reset();
          this.durationButtons[6].selected = false;
        }, 0);
      }
    });
    this.loadHolidays();
  }

  ngOnDestroy(): void {
    this.observeControlsTime?.unsubscribe();
  }

  private checkOldLeave(): void {
    this.isOldLeave =
      moment().isAfter(this.data.start_date) && !moment().isSame(this.data.start_date, 'day');
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      if (this.isDayHoliday(cellDate)) {
        return 'example-custom-date-holiday-class';
      }
      return '';
    }
    return '';
  };

  private isDayHoliday(date: any): boolean {
    date = moment(date).format('YYYY-MM-DD');
    const isworkingDay: any = this.holidays[date]?.is_working_day;
    return isworkingDay === 0 && !!this.holidays[date];
  }
  loadHolidays(): void {
    this.holidaysService.getHoliday().subscribe((res) => {
      if (res.success) {
        this.holidaysList = res.data;
        for (const holiday of res.data) {
          this.holidays[holiday.date] = holiday;
        }
      }
    });
  }
  dateRangeChange(event: any): void {
    this.date = moment(event.value).format('YYYY-MM-DD');
    this.eventForm.controls.date.setValue(this.date);
    this.eventForm.updateValueAndValidity();
    this.toggleTodayAlreadyEvent();
  }

  convertToMin(time: any): number {
    const arr = time.split(':');
    return +(arr[0] * 60) + +arr[1];
  }

  changeEventType(event: any): void {
    for (const item of this.eventTypeButtons) {
      item.selected = false;
    }
    this.selectType = event.id;
    this.meetingType = event.event_type;
  }

  confirm(): void {
    this.createEvents();
    this.dialogRef.close({ data: 'you confirmed' });
  }
  update(): void {
    this.eventForm.addControl('id', new FormControl(this.data.id));
    const data = this.eventForm.getRawValue();
    data.title = data.title.trim();
    data.description = data.description.trim();
    data.duration = String(data.duration);
    (data.participants = String(this.eventForm.controls.participants.value)),
      (data.date = moment(data.date).format('YYYY-MM-DD'));
    this.eventService.updateEvent(data).subscribe(
      () => {
        this.toastr.success('The event successfully updated');
        this.dialogRef.close({ data: 'you confirmed' });
      },
      () => {
        this.toastr.success('Something went wrong');
      },
    );
  }

  loadImage(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    if (file.size > 2_000_000) {
      this.isErrorMessageImageUpload = true;
      return;
    }
    this.isErrorMessageImageUpload = false;
    const self = this;
    fileReader.onload = (_) => {
      self.fileUrl = fileReader.result;
    };
    fileReader.readAsDataURL(file);
    this.uploadService.upload(file).subscribe(
      (res: any) => {
        this.eventForm.controls.photo.setValue(res.data.file);
      },
      (_) => {
        this.toastr.error('Something went wrong', 'Fail !');
      },
    );
  }
  writeLocationOnReview(event: any): void {
    this.location = event.target.value;
  }

  getEmployee(): void {
    this.employeeService.getEmployeeList().subscribe((res) => {
      for (const arr of res.data) {
        this.participantsData.push(arr);
        for (const emp of arr.employees) {
          this.allEmployers.push(emp);
        }
      }
    });
  }

  createEvents(): void {
    const eventData = this.eventForm.getRawValue();
    eventData.title = eventData.title.trim();
    eventData.description = eventData.description.trim();
    eventData.participants = String(eventData.participants);
    eventData.type = this.selectType;
    this.eventService.createEvent(eventData).subscribe(
      (_) => {
        this.toastr.success('Event successfully created.', 'Greate !');
      },
      (_) => {
        this.toastr.error('Something went wrong', 'Fail !');
      },
    );
  }

  timeWrite(event: any): void {
    const eventValue = event.target.value;
    if (eventValue.length === 2) {
      this.timeValue = eventValue + ':';
    }
  }
  deleteEvent(): void {
    const data = {
      id: this.data.id,
    };
    this.eventService.deleteEvent(data).subscribe(
      (_) => {
        this.toastr.success('Event successfully deleted.', 'Greate !');
        this.dialogRef.close({ data: 'you confirmed' });
      },
      (_) => {
        this.toastr.error('Something went wrong', 'Fail !');
      },
    );
  }
  selectDuration(event: any): void {
    if (this.eventForm.controls.duration.valid && this.data) {
      for (const btn of this.durationButtons) {
        btn.selected = btn.value === event.value;
      }
      this.eventForm.controls.duration.setValue(event.value);
    }
  }
  private noWhitespaceValidator(control: FormControl): { whitespace: boolean } | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  // for disable button
  private changeStartTime(timeSelected: string = '09:00'): void {
    const currentTime = timeSelected.split(':');
    const date = moment().set({
      hour: Number(currentTime[0]),
      minute: Number(currentTime[1]),
    });

    for (const duration of this.durationButtons) {
      const time = date.clone();
      time.add(duration.value, 'minutes');
      duration.disable = moment('23:01', 'HH:mm').isBefore(time);
    }
  }
  toggleTodayAlreadyEvent(): void {
    const date = this.eventForm.controls.date.value;
    this.eventService.getEventList(0, date, date).subscribe((event) => {
      this.isShowWarningMessageDuplicateEvent = !!(
        event.data.length || moment(event.nearby?.start_date).isSame(date, 'day')
      );
    });
  }
}
