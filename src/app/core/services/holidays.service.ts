import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Holiday } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient, private authService: AuthService) {}
  getHoliday(): Observable<Holiday> {
    return this.http.get<Holiday>(`${this.API_URL}/user/holidays`);
  }
}
