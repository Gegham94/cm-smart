import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { DayOff } from '@models/day-off';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DayOffsAndVacationsService {
  API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  // GET
  getDayOffs(): Observable<DayOff> {
    return this.http.get<DayOff>(`${this.API_URL}/user/leave-list`);
  }
  getDayOffsDetail(id: number) {
    return this.http.get(`${this.API_URL}/leave/detail?id=${id}`);
  }

  // POST
  // Take book leave
  takeDayOff(day: string, description: string) {
    return this.http.post(`${this.API_URL}/user/take-day-off`, {
      day,
      description,
    });
  }
  takeWorkRemotely(day: string, description: string) {
    return this.http.post(`${this.API_URL}/user/work-remotely`, {
      day,
      description,
    });
  }
  takeVacations(start_day: string, end_day: string, description: string) {
    return this.http.post(`${this.API_URL}/user/take-vacation`, {
      start_day,
      end_day,
      description,
    });
  }
  takeHourlyLeave(start_day_time: string, minutes: string, description: string) {
    return this.http.post(`${this.API_URL}/user/take-hourly-leave`, {
      start_day_time,
      minutes,
      description,
    });
  }

  // Update book leave
  updateDayOff(day: string, description: string, id: number) {
    return this.http.post(`${this.API_URL}/leave/update`, {
      day,
      description,
      id,
    });
  }
  updateWorkRemotely(day: string, description: string, id: number) {
    return this.http.post(`${this.API_URL}/leave/update`, {
      day,
      description,
      id,
    });
  }
  updateVacations(start_day: string, end_day: string, description: string, id: number) {
    return this.http.post(`${this.API_URL}/leave/update`, {
      start_day,
      end_day,
      description,
      id,
    });
  }
  updateHourlyLeave(start_day_time: string, minutes: string, description: string, id: number) {
    return this.http.post(`${this.API_URL}/leave/update`, {
      start_day_time,
      minutes,
      description,
      id,
    });
  }

  // Cancel book leave
  deleteDayOffById(id: number) {
    return this.http.post(`${this.API_URL}/leave/cancel`, { id });
  }
}
