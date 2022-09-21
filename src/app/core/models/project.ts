import { EmployeeData } from './employee-data';

export interface Project {
  id: number;
  title: string;
  status: string;
  employees: EmployeeData[];
}
