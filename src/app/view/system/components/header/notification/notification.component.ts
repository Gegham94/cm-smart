import { Component, OnDestroy, OnInit } from '@angular/core';

import { mergeMap, startWith } from 'rxjs/operators';
import { NotificationData } from '../../../../../core/models';
import { environment } from '../../../../../../environments/environment';
import { Subscription, interval } from 'rxjs';
import { NotificationsService } from '../../../../../core/services';
import * as moment from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  API_URL = environment.API_URL;
  notificationData: NotificationData[] = [];
  notificationPoint: boolean = false;
  notificationCountSub?: Subscription;
  isOpen: boolean = false;
  public moment: any = moment;

  constructor(private notifications: NotificationsService) {}
  ngOnInit(): void {
    this.notificationCountSub = interval(2 * 60 * 1000)
      .pipe(
        startWith(0),
        mergeMap(() => this.notifications.notificationsCount()),
      )
      .subscribe((res) => (this.notificationPoint = res.data.count != 0));
  }

  subNotification() {
    // update date notifications
    this.notificationPoint = false;
    this.notifications
      .notifications()
      .subscribe((res) => (this.notificationData = res.data.concat()));
  }
  read(index: number, status: number) {
    if (status) return;
    let notice = this.notificationData[index];
    const id = notice.id;
    this.notifications.notificationsUpdateStatus(id.toString(), 1).subscribe(
      (res) => {
        if (res.success) notice.status = 1;
      },
      (error) => console.error(error),
    );
  }
  delete(index: number) {
    let notice = this.notificationData[index];
    const id = notice.id;
    this.notifications.notificationsUpdateStatus(id.toString(), 2).subscribe(
      (res) => {
        if (res.success) this.notificationData.splice(index, 1);
      },
      (error) => console.error(error),
    );
  }

  ngOnDestroy(): void {
    // unsubscribe unpdate Notification
    this.notificationCountSub?.unsubscribe();
  }
  showNotification(): void {
    if (!this.isOpen) this.subNotification();
    this.isOpen = !this.isOpen;
  }
  autoCloseForEventDropDown(event: any): void {
    const target = event.target;
    if (this.isOpen) {
      if (!target.closest('.dropdown-notification')) {
        this.isOpen = false;
        return;
      }
    }
  }
}
