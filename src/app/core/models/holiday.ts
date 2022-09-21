import { HolidaysData } from '.';

export interface Holiday {
  success: boolean;
  message: string;
  errors: [];
  data: HolidaysData[];
}
