import { EventData } from '.';

export interface Event {
  data: EventData[];
  nearby: EventData;
}
