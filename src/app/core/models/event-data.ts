import { Organizer } from '.';
import { ParticipantsData } from './participants-data';

export interface EventData {
  id: number;
  title: string;
  description: string;
  time: string;
  place: string;
  date: string;
  photo?: any;
  duration: string;
  type: number;
  organizer: Organizer;
  room: string;
  participants: ParticipantsData[];
  start_date: string;
  end_date: string;
  total: number;
}
