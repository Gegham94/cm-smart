import { EmployeeData } from './employee-data';

export interface ParticipantsData {
  employees: EmployeeData[];
  team: string;
  total: number;
}
