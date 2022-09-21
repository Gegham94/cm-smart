import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DurationButtons } from '../../../core/models';
import { TaskCreateDialogService } from '../../../core/services/task-create-dialog.service';
import { TaskCreateStep } from '../../enums/task-create-step.enum';

@Component({
  selector: 'app-select-task-duration',
  templateUrl: './select-task-duration.component.html',
  styleUrls: ['./select-task-duration.component.scss'],
})
export class SelectTaskDurationComponent implements OnChanges {
  @Input()
  public durationFormGroup!: FormGroup;

  public hourDozens: number | null = 0;
  public hour: number | null = 0;
  public minuteDozens: number | null = 0;
  public minute: number | null = 0;
  public isOther = false;

  public readonly customPatterns = { m: { pattern: /[0-5]{1}/ims } };
  public readonly durationButtons: DurationButtons[] = [
    { id: 1, title: '15 Minute', selected: false, disable: false, value: 15 },
    { id: 2, title: '30 Minute', selected: false, disable: false, value: 30 },
    { id: 3, title: '1 Hour', selected: false, disable: false, value: 60 },
    { id: 4, title: '2 Hours', selected: false, disable: false, value: 120 },
    { id: 5, title: '3 Hours', selected: false, disable: false, value: 180 },
    { id: 6, title: 'Half day', selected: false, disable: false, value: 240 },
    { id: 7, title: 'Full day', selected: false, disable: false, value: 480 },
  ];

  constructor(private readonly taskCreateDialogService: TaskCreateDialogService) {}

  public ngOnChanges(): void {
    const value = this.durationFormGroup.get('duration')?.value;
    if (value) {
      const activeDuration = this.durationButtons.find((duration: DurationButtons): boolean => {
        return duration.value === value;
      });
      if (activeDuration) {
        activeDuration.selected = true;
      } else {
        this.hourDozens = Math.floor(value / 60 / 10);
        this.hour = Math.floor((value / 60) % 10);
        this.minuteDozens = Math.floor((value - this.hour * 60 - this.hourDozens * 10 * 60) / 10);
        this.minute = Math.floor((value - this.hour * 60 - this.hourDozens * 10 * 60) % 10);
        this.activateOtherDuration();
      }
    } else if (this.durationButtons.find((duration) => duration.value === value)) {
      this.isOther = true;
    } else {
      this.durationButtons[0].selected = true;
      this.durationFormGroup.get('duration')?.setValue(this.durationButtons[0].value);
    }
  }

  public activateDuration(id: number): void {
    this.durationButtons.forEach((duration: DurationButtons): void => {
      duration.selected = duration.id === id;
      if (duration.selected) {
        this.durationFormGroup.get('duration')?.setValue(duration?.value);
      }
    });
    this.isOther = false;
  }

  public activateOtherDuration(): void {
    this.isOther = true;
    this.durationButtons.forEach((duration) => {
      duration.selected = false;
    });
    this.durationFormGroup.get('duration')?.setValue(null);
  }

  public goToDescription(): void {
    this.taskCreateDialogService.setActiveStep(TaskCreateStep.TitleAndDescription);
  }

  public setFormControl(event: Event): void {
    event.preventDefault();
    const currentIndex = (event.currentTarget as HTMLElement).getAttribute('data-index');
    if (currentIndex) {
      const nextInput = document.querySelector<HTMLInputElement>(
        `.select-duration__other-input[data-index="${String(+currentIndex + 1)}"]`,
      );

      if (nextInput) {
        nextInput.focus();
        nextInput.value = '';
      }
    }

    this.durationFormGroup
      .get('duration')
      ?.setValue(this.isOtherDurationValid ? this.otherDuration : null);
    this.durationFormGroup.updateValueAndValidity();
  }

  public get isOtherDurationValid(): boolean {
    return this.otherDuration > 0;
  }

  public get otherDuration(): number {
    return (
      (Number(this.hourDozens) * 10 + Number(this.hour)) * 60 +
      Number(this.minuteDozens) * 10 +
      Number(this.minute)
    );
  }
}
