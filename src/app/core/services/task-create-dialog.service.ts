import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TaskDialogStep } from '@models/task-dialog-step.interface';
import { TaskCreateStep } from '../../shared/enums/task-create-step.enum';
import { TaskDialogSteps } from '../../view/system/components/dialog/task/create-update-task-model/constants/task-dialog-steps.constant';

@Injectable()
export class TaskCreateDialogService {
  private currentStep$: BehaviorSubject<TaskDialogStep> = new BehaviorSubject<TaskDialogStep>(
    TaskDialogSteps[0],
  );
  private currentStepNumber$: BehaviorSubject<TaskCreateStep> = new BehaviorSubject<TaskCreateStep>(
    TaskCreateStep.SelectDay,
  );
  private hasSaved$: Subject<void> = new Subject<void>();

  public get currentStep(): Observable<TaskDialogStep> {
    return this.currentStep$.asObservable();
  }

  public get currentStepNumber(): Observable<TaskCreateStep> {
    return this.currentStepNumber$.asObservable();
  }

  public get hasSaved(): Observable<void> {
    return this.hasSaved$.asObservable();
  }

  public setActiveStep(step: TaskCreateStep): void {
    this.currentStepNumber$.next(step);
    this.currentStep$.next(
      TaskDialogSteps.find((taskStep) => taskStep.step === step) as TaskDialogStep,
    );
  }

  public nextStep(): void {
    this.setActiveStep(this.currentStepNumber$.value + 1);
  }

  public previousStep(): void {
    this.setActiveStep(this.currentStepNumber$.value - 1);
  }

  public taskCreated(): void {
    this.hasSaved$.next();
  }
}
