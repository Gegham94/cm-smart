import { Component, HostListener, OnInit } from '@angular/core';
import { UploadService } from '../../../../../core/services/upload.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EducationWorkplaceModalComponent } from './education-workplace-modal/education-workplace-modal.component';
import { HeaderService, ToDoService } from '../../../../../core/services';
import { CreateUpdateTaskComponent } from '../../dialog/task/create-update-task-model/create-update-task.component';
import { ToDoListData } from '@models/to-do-list-data';
import * as moment from 'moment';
import { SpentTimeTaskModelComponent } from '../../dialog/task/spent-time-task-model/spent-time-task-model.component';
import { ToDoChangeStatus } from '../../../../../core/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  projectNameData: { [id: number]: string } = {};
  loaderTask = false;
  userNameSurname!: string;
  email?: string;
  selectedIndex = 0;
  selectedIndex1 = null;
  isShowPassword = false;
  type = 'password';
  fileUrl?: any;
  selectedDate = new Date();
  showDatePicker = false;
  isShowMoreBlock!: boolean;
  startDate = new Date();
  toDoListData: ToDoListData[] = [];
  taskDataFiltered: ToDoListData[] = [];
  selected = {
    startDate: new Date(),
    endDate: new Date(),
  };
  today = moment().toDate();
  buttons = [
    { id: 1, title: 'Account' },
    { id: 2, title: 'Documents & salary' },
    { id: 3, title: 'Notifications' },
    { id: 4, title: 'Projects' },
    { id: 5, title: 'education & experience' },
    { id: 6, title: 'Tasks' },
  ];
  credentialForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    photo: new FormControl(''),
  });
  rangeTaskFilter = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  });

  constructor(
    private uploadService: UploadService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private todoService: ToDoService,
  ) {}

  @HostListener('document:click', ['$event']) onDocumentClick(event: any): void {
    this.showMoreBlock(2, event, event);
    event.stopPropagation();
  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
    this.email = currentUser.email;
    this.userNameSurname = currentUser.first_name + ' ' + currentUser.last_name;
    this.headerService.setHeaderValue('My profile');
    this.loadTasks();
    this.loadProjects();
  }

  selectTab(event: number, index: number): void {
    this.selectedIndex = index;
  }
  showPassword(): void {
    this.isShowPassword = !this.isShowPassword;
    if (this.isShowPassword) {
      this.type = 'text';
      return;
    }
    if (!this.isShowPassword) {
      this.type = 'password';
      return;
    }
  }
  filterTask(): void {
    if (!this.rangeTaskFilter.valid) {
      this.taskDataFiltered = this.resetFilterTasks;
      this.sortTasks();
      return;
    }
    const startDateControl = this.rangeTaskFilter.get('start');
    const endDateControl = this.rangeTaskFilter.get('end');
    const startDate: number = Number(
      new Date(startDateControl?.value ? (startDateControl.value as Date) : ''),
    );

    const endDate: number = Number(
      new Date(endDateControl?.value ? (endDateControl.value as Date) : ''),
    );

    this.taskDataFiltered = this.toDoListData.filter((val) => {
      const date = Number(new Date(val.due_date));
      return startDate <= date && date <= endDate;
    });
    this.sortTasks();
  }
  private loadProjects(): void {
    this.todoService.getProjects().subscribe((res) => {
      if (res.success) {
        res.data.forEach((value, _) => {
          this.projectNameData[value.id] = value.title;
        });
      }
    });
  }
  resetFilter(): void {
    this.rangeTaskFilter.reset();
    this.taskDataFiltered = this.resetFilterTasks;
    this.sortTasks();
  }
  private sortTasks(): ToDoListData[] {
    return this.taskDataFiltered.sort((left, right) => {
      return moment.utc(right.due_date).diff(moment.utc(left.due_date));
    });
  }
  loadTasks(): void {
    this.todoService.getList().subscribe((res) => {
      if (res.success) {
        this.toDoListData = this.checkStatusTask(res.data);
        this.taskDataFiltered = this.resetFilterTasks;

        this.sortTasks();
        this.filterTask();
      }
      this.loaderTask = false;
    });
  }

  spentTimeTask(index: number): void {
    const status = this.taskDataFiltered[index].status;
    // open dialog spent time
    if (
      moment().isAfter(this.taskDataFiltered[index].due_date) &&
      !moment().isSame(this.taskDataFiltered[index].due_date, 'day')
    ) {
      return;
    }

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
        this.todoService.event$.next();
      });
    } else {
      const data: ToDoChangeStatus = {
        id: this.taskDataFiltered[index].id,
        status: 0,
      };
      this.todoService.changeStatusTask(data).subscribe((res) => {
        if (res.success) {
          this.taskDataFiltered[index].status = 0;
          this.toastr.success('spent time  successfully deselected', 'Greate !');
          this.todoService.event$.next();
        }
      });
    }
  }
  deleteTask(index: number): void {
    const id = this.taskDataFiltered[index].id;
    this.todoService.deleteTask(id).subscribe((res) => {
      if (res.success) {
        const taskIndex = this.toDoListData.findIndex((i) => i.id === id);
        this.toDoListData.splice(taskIndex, 1);
        this.taskDataFiltered.splice(index, 1);
        this.toastr.success('Task successfully deleted', 'Greate !');
        this.todoService.event$.next();
      }
    });
  }
  openUpdateTask(index: number): void {
    const config: MatDialogConfig = {
      data: this.taskDataFiltered[index],
      autoFocus: false,
      width: '540px',
      panelClass: 'custom-MatDialog',
      disableClose: true,
      hasBackdrop: true,
    };

    const dialogRef = this.dialog.open(CreateUpdateTaskComponent, config);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) {
        return;
      }
      // update locale data
      this.taskDataFiltered[index].title = data.title;
      this.taskDataFiltered[index].due_date = data.due_date;
      this.taskDataFiltered[index].planned_time = data.planned_time;
      this.taskDataFiltered[index].project_id = data.project_id ? data.project_id : null;
      this.toastr.success('Task successfully updated', 'Greate !');
      this.filterTask();
      this.todoService.event$.next();
    });
  }
  checkStatusTask(tasks: ToDoListData[]): ToDoListData[] {
    return tasks.map((task) => {
      if (moment().isAfter(task.due_date, 'day') && task.status === 0) {
        task.status = 2;
      }
      return task;
    });
  }
  get resetFilterTasks(): ToDoListData[] {
    return this.toDoListData.filter((item) => {
      return moment().isAfter(item.due_date, 'day');
    });
  }
  loadImage(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    const self = this;
    fileReader.onload = (_) => {
      self.fileUrl = fileReader.result;
    };
    fileReader.readAsDataURL(file);
    this.uploadService.upload(file).subscribe(
      (res: any) => {
        this.credentialForm.controls.photo.setValue(res.data.file);
      },
      (_) => {
        this.toastr.error('Something went wrong', 'Fail !');
      },
    );
  }
  save(): void {
    console.log(this.credentialForm);
  }
  choosedDate(event: any): void {
    if (event.startDate !== null && event.startDate._d !== undefined) {
      // console.log(event.startDate._d);
      this.startDate = new Date(event.startDate._d);
      this.selectedDate = this.startDate;
      console.log(this.selected);
    } else if (event.startDate === null || event.endDate === null) {
      this.selectedDate = new Date();
      this.selected = {
        startDate: new Date(),
        endDate: new Date(),
      };
    }
  }
  showCalendar(): void {
    this.showDatePicker = true;
  }

  showMoreBlock(num: any, event: any, id: any): void {
    this.selectedIndex1 = id;
    if (num === 1) {
      this.isShowMoreBlock = true;
      event.stopPropagation();
    } else {
      this.isShowMoreBlock = false;
    }
  }

  openEducationWorkplaceModal(): void {
    const config: MatDialogConfig = {
      autoFocus: false,
      width: '540px',
      panelClass: ['custom-MatDialog', 'education-modal'],
      disableClose: true,
      hasBackdrop: true,
    };
    const dialogRef = this.dialog.open(EducationWorkplaceModalComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openTaskModal(): void {
    const config: MatDialogConfig = {
      autoFocus: false,
      width: '540px',
      panelClass: 'custom-MatDialog',
      disableClose: true,
      hasBackdrop: true,
    };
    const dialogRef = this.dialog.open(CreateUpdateTaskComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  isOldTask(date: any): boolean {
    return moment().isBefore(date) || moment().isSame(date, 'day');
  }
}
