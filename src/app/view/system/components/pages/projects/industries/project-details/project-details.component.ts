import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  constructor(public headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Industries');
  }
}
