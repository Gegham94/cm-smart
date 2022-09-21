import { NgModule } from '@angular/core';
import { CreateUpdateTaskComponent } from './create-update-task.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskCreateDialogService } from '@services/task-create-dialog.service';
import { SelectTaskDayModule } from '../../../../../../shared/components/select-task-day/select-task-day.module';
import { SelectTaskProjectModule } from '../../../../../../shared/components/select-task-project/select-task-project.module';
import { SelectTaskDurationModule } from '../../../../../../shared/components/task-info/select-task-duration.module';
import { TaskInfoModule } from '../../../../../../shared/components/select-task-duration/task-info.module';

@NgModule({
  declarations: [CreateUpdateTaskComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    SelectTaskDayModule,
    SelectTaskProjectModule,
    SelectTaskDurationModule,
    TaskInfoModule,
  ],
  providers: [TaskCreateDialogService],
  exports: [CreateUpdateTaskComponent],
})
export class CreateUpdateTaskModule {}
