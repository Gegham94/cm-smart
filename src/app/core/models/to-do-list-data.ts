export interface ToDoListData {
  id: number;
  title: string;
  description?: string;
  due_date: string;
  status: number;
  planned_time: number;
  spent_time: number;
  project_id?: number;
  justCreated: boolean;
}
