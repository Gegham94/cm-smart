import { NotificationData } from '@models/notification-data';

export interface Notification {
  success: boolean;
  message: string;
  errors: Array<string>;
  data: NotificationData[];
}
