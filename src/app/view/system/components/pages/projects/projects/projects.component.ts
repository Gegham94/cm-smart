import { Component, OnInit } from '@angular/core';

import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  constructor(public headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Projects');
  }
}
