import { Component, Input } from '@angular/core';

import { SidenavService } from '@services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  @Input() sidenavValue!: boolean;

  constructor(public sidenavService: SidenavService) {}

  public sidenavData = this.sidenavService.sidenav;
}
