import { NgModule } from '@angular/core';
import { TaskInfoComponent } from './task-info.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskInfoComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TaskInfoComponent],
})
export class TaskInfoModule {}
