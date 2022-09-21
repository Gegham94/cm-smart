import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from '../../../../core/services/projects.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../../../core/models/project';
import { EmployeeData } from '../../../../core/models';

@Component({
  selector: 'app-ongoing-projects',
  templateUrl: './ongoing-projects.component.html',
  styleUrls: ['./ongoing-projects.component.scss'],
})
export class OngoingProjectsComponent implements OnInit, OnDestroy {
  @Input()
  public isHistory = false;

  private projectSubscription?: Subscription;
  private readonly $destroyed: Subject<void> = new Subject<void>();

  public fileBaseUrl = 'https://manage-company.app';
  public isLoading = false;
  public onlyUserProjects?: boolean;
  public projectList: Project[] = [];
  public readonly displayedColumns: string[] = [
    'name',
    'lead',
    // Temporary commented cause of missing property from API
    // 'started_at',
    'members',
  ];

  constructor(private readonly projectService: ProjectsService) {}

  public ngOnInit(): void {
    this.fetchProjects();
  }

  public ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }

  /**
   * Gets projects list using service
   * @param onlyUserProjects: boolean = false
   */
  public fetchProjects(onlyUserProjects: boolean = false): void {
    if (onlyUserProjects !== this.onlyUserProjects) {
      this.isLoading = true;
      this.projectSubscription?.unsubscribe();
      this.onlyUserProjects = onlyUserProjects;
      this.projectSubscription = this.projectService
        .getProjects(this.isHistory ? 0 : 1, onlyUserProjects ? 1 : 0)
        .pipe(takeUntil(this.$destroyed))
        .subscribe((response) => {
          this.projectList = response.data;
          this.isLoading = false;
        });
    }
  }

  /**
   * Finds Team Lead from employee list and returns lead's name
   * @param employeeList: Array<EmployeeData & {role: string}>
   */
  public getLeadName(employeeList: Array<EmployeeData & { role: string }>): string {
    const lead = employeeList.find((employee): boolean => employee.role === 'Team Lead');
    return lead ? lead.name : '-';
  }
}
