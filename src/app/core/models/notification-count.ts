import { NotificationCountData } from './notification-count-data';

export interface NotificationCount {
  success: boolean;
  message: string;
  errors: Array<string>;
  data: NotificationCountData;
}
