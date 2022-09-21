import { Annual, Leaves, Vacations } from '.';

export interface DayOffData {
  leaves: Leaves[];
  vacations: Vacations[];
  annual_data: Annual;
}
