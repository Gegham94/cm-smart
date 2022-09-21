import { DayOffData } from '.';

export interface DayOff {
  success: boolean;
  message: string;
  errors: [];
  data: DayOffData;
}
