import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from '@services/header.service';
import { AuthService } from '@services/auth.service';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../dialog/settings-modal/settings-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() userInfoIsOpened!: boolean;
  @Output() infoIsOpened: EventEmitter<boolean> = new EventEmitter();
  showSideNav = false;

  headerTitle: string | undefined;
  resizedWindow!: boolean;
  @Output() sideNavEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public headerService: HeaderService,
    public authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.headerService.headerSubject.subscribe((data) => {
      this.headerTitle = data;
    });
  }
  hideAndShowNavbar(): void {
    this.showSideNav = !this.showSideNav;
    this.sideNavEmitter.emit(this.showSideNav);
  }
  openInfo(): void {
    if (this.userInfoIsOpened) {
      const popup = document.querySelector('#user_info');
      popup!.classList.remove('user_info_display');
      this.userInfoIsOpened = false;
      this.infoIsOpened.emit(this.userInfoIsOpened);
    } else {
      const popup = document.querySelector('#user_info');
      popup!.classList.add('user_info_display');
      this.userInfoIsOpened = true;
      this.infoIsOpened.emit(this.userInfoIsOpened);
    }
  }
  logout(): void {
    this.authService.logout().subscribe((response) => {
      if (response.success === true) {
        this.router.navigate(['']);
      }
    });
  }
  openSettingsPopUp() {
    const dialogPositions: DialogPosition = {
      top: '0',
      right: '0',
    };

    const config = {
      disableClose: false,
      position: dialogPositions,
      width: '300px',
      height: '100vh',
      panelClass: [
        'animate__animated',
        'animate__slideInRight',
        'animate__slideInRight',
        'event-detail-modal',
        'custom-dialog-container-padding-0',
      ],
      autoFocus: true,
      hasBackdrop: true,
    };
    this.dialog.open(SettingsModalComponent, config);
  }
}
