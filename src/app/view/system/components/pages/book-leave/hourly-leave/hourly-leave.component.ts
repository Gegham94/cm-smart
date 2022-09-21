import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-hourly-leave',
  templateUrl: './hourly-leave.component.html',
  styleUrls: ['./hourly-leave.component.scss'],
})
export class HourlyLeaveComponent implements OnInit {
  @Input() displaySelectedDate!: string;
  @Input() displayLeaveTime: any;
  @Input() startTime!: string;
  constructor() {}

  ngOnInit(): void {
    if (!this.displaySelectedDate) {
      this.displaySelectedDate = moment().format('MMM DD');
    }
  }
}
