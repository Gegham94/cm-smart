import { NgModule } from '@angular/core';
import { SelectTaskProjectComponent } from './select-task-project.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SelectTaskProjectComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  exports: [SelectTaskProjectComponent],
})
export class SelectTaskProjectModule {}
