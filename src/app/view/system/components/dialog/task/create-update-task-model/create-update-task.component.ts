import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TaskCreateDialogService } from '@services/task-create-dialog.service';
import { TaskDialogStep } from '@models/task-dialog-step.interface';
import { TaskCreateStep } from '../../../../../../shared/enums/task-create-step.enum';
import { ToDoService } from '@services/to-do.service';
import { CreateUpdateTaskDto } from './dtos/create-update-task.dto';
import { TaskDialogData } from './interfaces/task-dialog-data.interface';
import { TaskDialogSteps } from './constants/task-dialog-steps.constant';
import { ToDoListData } from '@models/to-do-list-data';
import { organizationalProcessList } from '../../../../../../shared/constants/organizational-process-list';

@Component({
  selector: 'app-create-update-task-model',
  templateUrl: './create-update-task.component.html',
  styleUrls: ['./create-update-task.component.scss'],
})
export class CreateUpdateTaskComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public currentStep!: TaskDialogStep;
  public loader = false;
  public readonly taskDialogSteps = TaskDialogSteps;
  public readonly TaskCreateStep = TaskCreateStep;

  private readonly destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private readonly toDoService: ToDoService,
    private readonly taskCreateDialogService: TaskCreateDialogService,
    private readonly toastr: ToastrService,
    private readonly dialogRef: MatDialogRef<CreateUpdateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: TaskDialogData,
  ) {}

  public ngOnInit(): void {
    this.initializeComponent();
    this.initializeListeners();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private initializeComponent(): void {
    this.form = new FormGroup({
      dayForm: new FormGroup(
        {
          day: new FormControl('', [Validators.required]),
        },
        [Validators.required],
      ),
      projectForm: new FormGroup(
        {
          project: new FormControl('', [Validators.required]),
          organizationalProcess: new FormControl(''),
        },
        [Validators.required],
      ),
      infoForm: new FormGroup(
        {
          title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
          description: new FormControl(''),
        },
        [Validators.required],
      ),
      durationForm: new FormGroup(
        {
          duration: new FormControl('', [Validators.required]),
        },
        [Validators.required],
      ),
    });

    if (
      this.dialogData &&
      this.dialogData.taskToUpdate &&
      this.dialogData.updateStep !== undefined
    ) {
      this.form.patchValue(CreateUpdateTaskDto.deserialize(this.dialogData.taskToUpdate));
      this.form.updateValueAndValidity();
      this.setActiveStep(this.dialogData.updateStep);
    }
  }

  private initializeListeners(): void {
    this.taskCreateDialogService.currentStep.pipe(takeUntil(this.destroyed$)).subscribe((step) => {
      this.currentStep = step;
    });

    this.taskCreateDialogService.hasSaved.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.dialogRef.close();
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.taskCreateDialogService.setActiveStep(TaskCreateStep.SelectDay);
    });
  }

  public nextStep(): void {
    if (
      this.currentStep.step === TaskCreateStep.ProjectsOrOrganization &&
      !this.projectsForm.get('project')?.value &&
      !this.projectsForm.get('organizationalProcess')?.value
    ) {
      const newId = Date.now();
      organizationalProcessList.push({
        id: newId,
        title: this.infoForm.get('title')?.value,
      });
      this.projectsForm.get('organizationalProcess')?.setValue(newId);
    }

    this.taskCreateDialogService.nextStep();
  }

  public addTask(): void {
    this.toDoService.createTask(CreateUpdateTaskDto.serialize(this.form.value)).subscribe(
      (res) => {
        if (res.success) {
          this.taskCreateDialogService.taskCreated();
          this.taskCreateDialogService.setActiveStep(TaskCreateStep.SelectDay);
          this.toastr.success('Task successfully created', 'Great!');
        } else {
          this.toastr.error(res.error.message, 'Error!');
        }
      },
      (err) => {
        this.toastr.error(err.message, 'Error!');
      },
    );
  }

  public updateTask(): void {
    const updateTaskData: ToDoListData = {
      ...(this.dialogData?.taskToUpdate ?? {}),
      ...CreateUpdateTaskDto.serialize(this.form.value),
    } as ToDoListData;

    this.toDoService.updateTask(updateTaskData).subscribe(
      (res) => {
        if (res.success) {
          this.taskCreateDialogService.taskCreated();
          this.taskCreateDialogService.setActiveStep(TaskCreateStep.SelectDay);
          this.toastr.success('Task successfully updated', 'Great!');
        } else {
          this.toastr.error(res.error.message, 'Error!');
        }
      },
      (err) => {
        this.toastr.error(err.message, 'Error!');
      },
    );
  }

  public previousStep(): void {
    this.taskCreateDialogService.previousStep();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public get selectDayForm(): FormGroup {
    return this.form.get('dayForm') as FormGroup;
  }

  public get projectsForm(): FormGroup {
    return this.form.get('projectForm') as FormGroup;
  }

  public get infoForm(): FormGroup {
    return this.form.get('infoForm') as FormGroup;
  }

  public get durationForm(): FormGroup {
    return this.form.get('durationForm') as FormGroup;
  }

  public get currentFormValid(): boolean {
    switch (this.currentStep?.step) {
      case TaskCreateStep.SelectDay:
        return this.selectDayForm.valid;
      case TaskCreateStep.ProjectsOrOrganization:
        return !!(
          this.projectsForm.get('project')?.value ||
          this.projectsForm.get('organizationalProcess')?.value ||
          this.infoForm.get('title')?.value
        );
      case TaskCreateStep.TitleAndDescription:
        return this.infoForm.valid;
      case TaskCreateStep.SelectDuration:
        return this.durationForm.valid;
    }
  }

  public get backButtonDisabled(): boolean {
    return this.currentStep.step === TaskCreateStep.SelectDay;
  }

  private setActiveStep(updateStep: TaskCreateStep): void {
    this.taskCreateDialogService.setActiveStep(updateStep);
  }
}
