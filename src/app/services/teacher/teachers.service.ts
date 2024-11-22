import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Teacher} from '../../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  constructor(private httpClient:HttpClient) { }

  getTeachers(): Observable<Teacher[]>{
    return this.httpClient.get<Teacher[]>('http://localhost:8080/api/teachers');
  }

}
