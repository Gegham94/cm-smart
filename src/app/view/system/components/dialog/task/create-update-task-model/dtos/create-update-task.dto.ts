import * as moment from 'moment';
import { TaskForm } from '../interfaces/task-form.interface';
import { ToDoCreate } from '@models/to-do-create';

export class CreateUpdateTaskDto {
  public static serialize(formData: TaskForm): ToDoCreate {
    return {
      due_date: moment(formData.dayForm.day).format('YYYY-MM-DD'),
      planned_time: formData.durationForm.duration,
      project_id: formData.projectForm.project,
      organization_id: formData.projectForm.organizationalProcess,
      title: formData.infoForm.title,
      description: formData.infoForm.description,
    };
  }

  public static deserialize(todo: ToDoCreate): TaskForm {
    return {
      dayForm: {
        day: todo.due_date,
      },
      durationForm: {
        duration: todo.planned_time,
      },
      infoForm: {
        title: todo.title,
        description: todo.description,
      },
      projectForm: {
        project: todo.project_id,
        organizationalProcess: todo.organization_id,
      },
    };
  }
}
