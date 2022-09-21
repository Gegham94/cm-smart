import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseI } from '../models';
import { Project } from '../models/project';

@Injectable()
export class ProjectsService {
  API_URL = environment.API_URL;

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Gets projects using Get request to API
   * @param isOngoing: 0 | 1
   * @param onlyUserProjects: 0 | 1
   */
  public getProjects(
    isOngoing?: 0 | 1,
    onlyUserProjects?: 0 | 1,
  ): Observable<ResponseI<Project[]>> {
    return this.httpClient.get<ResponseI<Project[]>>(`${this.API_URL}/projects/list`, {
      params: {
        ongoing: String(isOngoing),
        my_projects: String(onlyUserProjects),
      },
    });
  }
}
