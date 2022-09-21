import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {
  AbsentMembersData,
  ProjectsListData,
  ResponseI,
  ToDoChangeStatus,
  ToDoListData,
} from '../models';
import { ToDoCreate } from '../models/to-do-create';

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  event$ = new Subject<boolean>();
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}
  // GET

  getProjects(): Observable<ResponseI<ProjectsListData[]>> {
    return this.http.get<ResponseI<ProjectsListData[]>>(`${this.API_URL}/to-do/projects-list`);
  }

  getList(): Observable<ResponseI<ToDoListData[]>> {
    return this.http.get<ResponseI<ToDoListData[]>>(`${this.API_URL}/to-do/list`);
  }
  getAbsentMembers(): Observable<any> {
    return this.http.get<ResponseI<AbsentMembersData[]>>(`${this.API_URL}/site/absent-members`);
  }
  // POST
  createTask(data: ToDoCreate): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/to-do/create`, data);
  }
  updateTask(data: ToDoCreate): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/to-do/update`, data);
  }
  deleteTask(id: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/to-do/delete`, { id: id });
  }
  changeStatusTask(data: ToDoChangeStatus): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/to-do/change-status`, data);
  }
}
