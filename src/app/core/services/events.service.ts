import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '@models/event';
import { environment } from '@env';
import { EventData } from '@models/event-data';
import { ResponseI } from '@models/responseData';
@Injectable({
  providedIn: 'root',
})
export class EventsService {
  jsonUrl = '/assets/json/events.json';
  params = new HttpParams();
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getEvents(): Observable<ResponseI<EventData[]>> {
    return this.http.get<ResponseI<EventData[]>>(`${this.API_URL}/event/list`);
  }

  createEvent(data: EventData): Observable<EventData> {
    return this.http.post<EventData>(`${this.API_URL}/event/create`, data);
  }

  getEventList(whoseEvent?: any, start?: any, end?: any): Observable<Event> {
    this.params = this.params.set('my_events', whoseEvent);
    this.params = this.params.set('start', start);
    this.params = this.params.set('end', end);
    return this.http.get<Event>(`${this.API_URL}/event/list`, {
      params: this.params,
    });
  }
  updateEvent(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/event/update`, data);
  }
  deleteEvent(data: object): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/event/delete`, data);
  }
}
