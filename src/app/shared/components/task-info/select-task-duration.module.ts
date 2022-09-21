import { NgModule } from '@angular/core';
import { SelectTaskDurationComponent } from './select-task-duration.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SelectTaskDurationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild(),
    FormsModule,
    MatIconModule,
  ],
  exports: [SelectTaskDurationComponent],
})
export class SelectTaskDurationModule {}
