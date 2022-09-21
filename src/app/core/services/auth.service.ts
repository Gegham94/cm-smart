import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { CustomHttpParamEncoder } from '@services/CustomHttpParamEncoder';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login, ResponseI, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  API_URL = environment.API_URL;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  params = new HttpParams({ encoder: new CustomHttpParamEncoder() });

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('currentUser') as string),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public updateCurrentUserValue(value: User | null): void {
    this.currentUserSubject.next(value);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject?.value;
  }

  login(body: Login) {
    return this.http
      .post<ResponseI<Login>>(`${this.API_URL}/site/login`, body, {
        headers: this.headers,
        params: this.params,
      })
      .pipe(
        map((response: ResponseI<Login>) => {
          if (response && response.data.auth_key) {
            const data = {
              employee_id: response.data.employee_information.id,
              auth_key: response.data.auth_key,
              first_name: response.data.employee_information.first_name,
              last_name: response.data.employee_information.last_name,
              personal_photo: response.data.employee_information.personal_photo,
              email: response.data.employee_information.email,
              id: response.data.id,
              role: response.data.role,
            };
            localStorage.setItem('currentUser', JSON.stringify(data));
            this.currentUserSubject.next(response.data.employee_information);
          }
          return response;
        }),
      );
  }

  logout() {
    return this.http.post<ResponseI<[]>>(`${this.API_URL}/site/logout`, {}).pipe(
      map((response: ResponseI<[]>) => {
        if (response && response.success === true) {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        }
        return response;
      }),
    );
  }

  resetPassword(body: string) {
    return this.http.post<ResponseI<[]>>(`${this.API_URL}/site/reset-password`, body, {
      headers: this.headers,
      params: this.params,
    });
  }
}
