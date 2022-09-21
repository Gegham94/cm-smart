import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import { ToDoService } from '@services/to-do.service';
import { ToDoChangeStatus } from '@models/to-do-change-status';

@Component({
  selector: 'app-spent-time-task-model',
  templateUrl: './spent-time-task-model.component.html',
  styleUrls: ['./spent-time-task-model.component.scss'],
})
export class SpentTimeTaskModelComponent {
  loader = false;
  form: FormGroup = this.fb.group({
    duration: new FormControl('', Validators.required),
  });
  public otherChecked = false;
  public hourDozens: number | null = 0;
  public hour: number | null = 0;
  public minuteDozens: number | null = 0;
  public minute: number | null = 0;
  public customPatterns = { m: { pattern: /[0-5]{1}/ims } };

  constructor(
    private fb: UntypedFormBuilder,
    private toDo: ToDoService,
    private dialogRef: MatDialogRef<SpentTimeTaskModelComponent>,
    @Inject(MAT_DIALOG_DATA) private id: number,
  ) {}

  // change request
  submit(): void {
    if (!this.form.valid) {
      return;
    }
    const value = this.form.get('duration')?.value;
    const data: ToDoChangeStatus = {
      id: this.id,
      spent_time: value,
      status: 1,
    };
    this.loader = true;
    this.toDo.changeStatusTask(data).subscribe((res) => {
      if (res.success) {
        this.dialogRef.close(Number(value));
      }
      this.loader = false;
    });
  }

  public otherStateChange(event: Event): void {
    this.otherChecked = (event.target as HTMLInputElement).checked;

    if (this.otherChecked) {
      this.form.get('duration')?.setValue(null);
    }
  }

  public disableOtherForm(): void {
    this.otherChecked = false;
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

    this.form.get('duration')?.setValue(this.isOtherDurationValid ? this.otherDuration : null);
    this.form.updateValueAndValidity();
  }

  public get otherDuration(): number {
    return (
      (Number(this.hourDozens) * 10 + Number(this.hour)) * 60 +
      Number(this.minuteDozens) * 10 +
      Number(this.minute)
    );
  }

  public get isOtherDurationValid(): boolean {
    return this.otherDuration > 0;
  }
}
