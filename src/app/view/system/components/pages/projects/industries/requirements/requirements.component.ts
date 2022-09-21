import { Component, OnInit } from '@angular/core';
import { HeaderService } from '@services/header.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
})
export class RequirementsComponent implements OnInit {
  constructor(public headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerService.setHeaderValue('Industries');
  }
}
