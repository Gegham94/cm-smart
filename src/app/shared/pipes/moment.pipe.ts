import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  public transform(date: Date, format: string): string {
    return moment(date).format(format);
  }
}
