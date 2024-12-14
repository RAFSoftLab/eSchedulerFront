import {Teacher} from './teacher.model';
import {Subject} from './subject.model';

export interface Distribution {
  id: number;
  teacher: Teacher ;
  subject: Subject;
  classType: string;
  sessionCount: number;
}
