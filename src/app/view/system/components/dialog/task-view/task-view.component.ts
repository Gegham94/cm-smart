import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import * as moment from 'moment/moment';

import { TaskCreateStep } from '../../../../../shared/enums/task-create-step.enum';
import { TaskCreateDialogService } from '@services/task-create-dialog.service';
import { ToDoListData } from '../../../../../core/models';
import { CreateUpdateTaskComponent } from '../task/create-update-task-model/create-update-task.component';
import { ToDoService } from '../../../../../core/services';
import { TaskDialogData } from '../task/create-update-task-model/interfaces/task-dialog-data.interface';

@Component({
  selector: 'app-create-update-task-model',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  public readonly TaskCreateStep = TaskCreateStep;

  constructor(
    @Inject(MAT_DIALOG_DATA) public task: ToDoListData & { project: string },
    public readonly dialogRef: MatDialogRef<TaskViewComponent>,
    private readonly dialog: MatDialog,
    private readonly toDo: ToDoService,
    private readonly taskCreateDialogService: TaskCreateDialogService,
  ) {}

  public ngOnInit(): void {
    this.taskCreateDialogService.hasSaved.subscribe(() => {
      this.dialogRef.close();
    });
  }

  public checkIfFailed(): boolean {
    return moment().isAfter(this.task.due_date, 'day') && this.task.status === 0;
  }

  public openUpdateTask(updateStep: TaskCreateStep): void {
    const config: MatDialogConfig<TaskDialogData> = {
      data: {
        taskToUpdate: this.task,
        updateStep,
      },
      autoFocus: false,
      width: '542px',
      panelClass: 'custom-MatDialog',
      disableClose: true,
      hasBackdrop: true,
    };

    const dialogRef = this.dialog.open(CreateUpdateTaskComponent, config);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) {
        return;
      }

      this.dialogRef.close();
      this.toDo.event$.next();
    });
  }

  public get customPlannedTime(): string {
    return `${
      Math.floor(this.task.planned_time / 60)
        ? `${Math.floor(this.task.planned_time / 60)} hours`
        : ''
    } ${Math.floor(this.task.planned_time / 60) && this.task.planned_time % 60 ? 'and' : ''} ${
      this.task.planned_time % 60 ? `${this.task.planned_time % 60} minutes` : ''
    }`;
  }
}
