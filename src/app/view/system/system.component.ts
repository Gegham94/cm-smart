import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
})
export class SystemComponent {
  sidenavValue!: boolean;
  windowInnerWidth!: boolean;
  userInfoIsOpened!: boolean;
  constructor(private route: ActivatedRoute, private router: Router) {}

  showSidenav(event: boolean): void {
    this.sidenavValue = event;
  }
  setCloseUserInfoValue(event: boolean) {
    this.userInfoIsOpened = event;
  }

  closeUserInfo() {
    this.userInfoIsOpened = false;
    const popup = document.querySelector('#user_info');
    popup!.classList.remove('user_info_display');
  }
}
