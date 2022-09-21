import { Sender } from '@models/sender';

export interface NotificationData {
  id: number;
  date: Date;
  sender: Sender;
  title: string;
  status: number;
}
