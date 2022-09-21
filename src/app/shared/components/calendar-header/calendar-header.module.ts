import { NgModule } from '@angular/core';
import { CalendarHeaderComponent } from './calendar-header.component';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CustomDateAdapter } from '../../../core/helpers/custom-date-adapter';

@NgModule({
  declarations: [CalendarHeaderComponent],
  imports: [CommonModule, MatSelectModule],
  providers: [CustomDateAdapter],
  exports: [CalendarHeaderComponent],
})
export class CalendarHeaderModule {}
