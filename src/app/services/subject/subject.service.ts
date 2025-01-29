import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Teacher} from '../../models/teacher.model';
import {Subject} from '../../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private httpClient:HttpClient) { }

  getSubjects(): Observable<Subject[]>{
    // return this.httpClient.get<Subject[]>('http://localhost:2525/api/subjects');
    return this.httpClient.get<Subject[]>('/api/subjects');

  }

  saveSubject(subject: Subject): Observable<Subject>{
    // return this.httpClient.post<Subject>('http://localhost:2525/api/subjects', subject);
    return this.httpClient.post<Subject>('/api/subjects', subject);

  }

  updateSubject(subject: Subject): Observable<Subject>{
    // return this.httpClient.put<Subject>('http://localhost:2525/api/subjects', subject);
    return this.httpClient.put<Subject>('/api/subjects', subject);

  }
  deleteSubject(id: number): Observable<any>{
    // return this.httpClient.delete('http://localhost:2525/api/subjects/'+id);
    return this.httpClient.delete('/api/subjects/'+id);

  }
}
