import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss'],
})
export class IndustriesComponent implements OnInit {
  constructor(public headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Industries');
  }
}
