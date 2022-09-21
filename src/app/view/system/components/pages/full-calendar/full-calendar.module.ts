import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent } from './full-calendar.component';
import { CalendarDateFormatter, CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule } from '@angular/forms';
import { CalendarHeaderComponent } from './demo-utils/calendar-header/calendar-header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomDateFormatter } from './CustomDateFormatter';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [FullCalendarComponent, CalendarHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: CalendarDateFormatter, useClass: CustomDateFormatter }],
})
export class FullCalendarModule {}
