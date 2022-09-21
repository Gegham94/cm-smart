import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { Employee } from '../models';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getEmployeeList(): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/user/employee-list`);
  }
}
