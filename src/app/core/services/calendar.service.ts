import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Calendar } from '../models';
@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getCalendar(year: string): Observable<Calendar> {
    return this.http.get<Calendar>(`${this.API_URL}/user/calendar?year=${year}`);
  }
}
