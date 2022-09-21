import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Notification } from '@models/notification';
import { Observable } from 'rxjs';
import { NotificationCount } from '@models/notification-count';
import { NotificationUpdateStatusData } from '@models/notification-update-status-data';
import { NotificationUpdateStatus } from '@models/notification-update-status';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  API_URL = [environment.API_URL, 'notification'].join('/');
  constructor(private toastr: ToastrService, private http: HttpClient) {}

  showSuccess(message: string, title: string): void {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string): void {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string): void {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string): void {
    this.toastr.warning(message, title);
  }
  notifications(): Observable<Notification> {
    return this.http.get<Notification>(`${this.API_URL}/list`);
  }
  notificationsCount(): Observable<NotificationCount> {
    return this.http.get<NotificationCount>(`${this.API_URL}/notification-count`);
  }
  notificationsUpdateStatus(id: string, status: number): Observable<NotificationUpdateStatus> {
    const data: NotificationUpdateStatusData = {
      id_list: id,
      status: status,
    };
    return this.http.post<NotificationUpdateStatus>(`${this.API_URL}/update-status`, data);
  }
}
