import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-day-off',
  templateUrl: './day-off.component.html',
  styleUrls: ['./day-off.component.scss'],
})
export class DayOffComponent {
  @Input() displaySelectedDayOffDate: any;
}
