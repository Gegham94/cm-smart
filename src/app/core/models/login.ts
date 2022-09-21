import { User } from '.';

export interface Login {
  username: string;
  auth_key: string;
  id: number;
  role: string;
  employee_information: User;
}
