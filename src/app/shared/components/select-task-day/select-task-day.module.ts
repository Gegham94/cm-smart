import { NgModule } from '@angular/core';
import { SelectTaskDayComponent } from './select-task-day.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SelectTaskDayComponent],
  imports: [CommonModule, MatIconModule],
  exports: [SelectTaskDayComponent],
})
export class SelectTaskDayModule {}
