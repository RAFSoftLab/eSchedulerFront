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


}
