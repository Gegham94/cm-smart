import { ToDoListData } from '@models/to-do-list-data';
import { TaskCreateStep } from '../../../../../../../shared/enums/task-create-step.enum';

export interface TaskDialogData {
  taskToUpdate?: ToDoListData;
  updateStep?: TaskCreateStep;
}
