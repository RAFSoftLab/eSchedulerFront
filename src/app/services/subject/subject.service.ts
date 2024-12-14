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
    return this.httpClient.get<Subject[]>('http://localhost:8080/api/subjects');
  }

  saveSubject(subject: Subject): Observable<Subject>{
    subject.id = 0;
    return this.httpClient.post<Subject>('http://localhost:8080/api/subjects', subject);
  }

  updateSubject(subject: Subject): Observable<Subject>{
    console.log("ZISOV");
    return this.httpClient.put<Subject>('http://localhost:8080/api/subjects', subject);
  }
  deleteSubject(id: number): Observable<any>{
    return this.httpClient.delete('http://localhost:8080/api/subjects/'+id);
  }
}
