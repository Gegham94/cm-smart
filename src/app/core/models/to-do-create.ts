export interface ToDoCreate {
  id?: number;
  title: string;
  due_date: string;
  planned_time: number;
  project_id?: number;
  organization_id?: number;
  description?: string;
}
