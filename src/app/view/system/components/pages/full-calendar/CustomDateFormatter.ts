import * as moment from 'moment/moment';
import { CalendarNativeDateFormatter, DateFormatterParams } from 'angular-calendar';

export class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date }: DateFormatterParams): string {
    return moment(date).format('HH') + ':00';
  }
  public weekViewHour({ date }: DateFormatterParams): string {
    return moment(date).format('HH') + ':00';
  }
}
