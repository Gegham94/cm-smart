import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  upload(file: any): Observable<any> {
    let formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(`${this.API_URL}/user/upload`, formData);
  }
}
