import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.scss'],
})
export class VacationComponent {
  @Input() displaySelectedDateRange: any;
}
