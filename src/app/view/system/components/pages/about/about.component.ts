import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@services/header.service';
import { chartData, colorScheme, dataRangeOptions } from './about-chart-data';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  view: any;
  chartData = chartData;
  colorScheme = colorScheme;
  dataRangeOptions = dataRangeOptions;
  displayDefaultRange: any;
  isOpenDataList = false;

  constructor(public headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('About Company');
    if (window.screen.width > 1800) {
      this.view = [window.screen.width - 100, 380];
    } else if (window.screen.width > 1600) {
      this.view = [window.screen.width - 150, 380];
    } else if (window.screen.width > 1309) {
      this.view = [window.screen.width - 200, 380];
    } else if (window.screen.width > 1100) {
      this.view = [window.screen.width + 80, 380];
    } else if (window.screen.width > 900) {
      this.view = [window.screen.width + 50, 380];
    } else if (window.screen.width > 600) {
      this.view = [window.screen.width, 380];
    }
  }

  onResize(event: any): void {
    if (event.target.innerWidth > 1800) {
      this.view = [event.target.innerWidth - 100, 380];
    } else if (event.target.innerWidth > 1600) {
      this.view = [event.target.innerWidth - 150, 380];
    } else if (event.target.innerWidth > 1309) {
      this.view = [event.target.innerWidth - 200, 380];
    } else if (event.target.innerWidth > 1100) {
      this.view = [event.target.innerWidth + 80, 380];
    } else if (event.target.innerWidth > 900) {
      this.view = [event.target.innerWidth + 50, 380];
    } else if (event.target.innerWidth > 600) {
      this.view = [event.target.innerWidth, 380];
    }
  }

  openDataRangeSelection(event?: boolean): void {
    if (event) {
      this.isOpenDataList = false;
    } else {
      this.isOpenDataList = !this.isOpenDataList;
    }
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
