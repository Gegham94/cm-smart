export interface NotificationUpdateStatus {
  success: boolean;
  message: string;
  errors: Array<string>;
  data: Array<any>;
}
