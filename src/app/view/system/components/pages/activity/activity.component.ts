import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@services/header.service';

import { chartData, colorScheme, dataRangeOptions } from '../about/about-chart-data';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  // pie
  projectView: any = [778, 300];
  projectChart = {
    chartData,
    colorScheme: {
      domain: ['#05BBAE', '#122346', '#F9B04D', '#008177'],
    },
    single: [
      {
        name: 'Website',
        value: 40,
      },
      {
        name: 'Ios',
        value: 70,
      },
      {
        name: 'Android',
        value: 60,
      },
      {
        name: 'Mobile',
        value: 90,
      },
    ],
  };

  progressTaskView: any;

  progressTask = {
    colorScheme,
    dataRangeOptions,
    chartData,
    isOpenDataList: false,
  };

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Activities');
    this.onResize(window.screen.width);
  }
  onResize(event: any): void {
    const eventWidth = event?.target?.innerWidth;
    const width = eventWidth ? eventWidth : event;
    this.progressTaskView = [width, 280];

    if (width > 1800) this.progressTaskView[0] -= 100;
    else if (width > 1600) this.progressTaskView[0] -= 150;
    else if (width > 1309) this.progressTaskView[0] -= 200;
    else if (width > 1100) this.progressTaskView[0] += 80;
    else if (width > 900) this.progressTaskView[0] += 50;
  }
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
