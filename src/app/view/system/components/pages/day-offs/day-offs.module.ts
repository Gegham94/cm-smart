import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { DayOffsComponent } from './day-offs.component';
import { DayOffsRoutingModule } from './day-offs-routing.module';
import { BookLeaveComponent } from '../book-leave/book-leave.component';
import { HourlyTimeSelectionComponent } from '../book-leave/hourly-time-selection/hourly-time-selection.component';
import {
  DatepickerComponent,
  DatepickerHeaderComponent,
} from '../book-leave/datepicker/datepicker.component';
import {
  DatepickerRangeComponent,
  DatepickerRangeHeaderComponent,
} from '../book-leave/datepicker-range/datepicker-range.component';
import { DayOffComponent } from '../book-leave/day-off/day-off.component';
import { HourlyLeaveComponent } from '../book-leave/hourly-leave/hourly-leave.component';
import { VacationComponent } from '../book-leave/vacation/vacation.component';
import { WorkRemotelyComponent } from '../book-leave/work-remotely/work-remotely.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    DayOffsComponent,
    BookLeaveComponent,
    HourlyTimeSelectionComponent,
    DatepickerComponent,
    DatepickerHeaderComponent,
    DatepickerRangeComponent,
    DatepickerRangeHeaderComponent,
    DayOffComponent,
    HourlyLeaveComponent,
    VacationComponent,
    WorkRemotelyComponent,
  ],
  imports: [
    CommonModule,
    DayOffsRoutingModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    NgxChartsModule,
    MatMenuModule,
    MatFormFieldModule,
  ],
  bootstrap: [DatepickerComponent, DatepickerRangeComponent, DatepickerRangeHeaderComponent],
})
export class DayOffsModule {}
