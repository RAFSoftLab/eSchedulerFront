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
    // return this.httpClient.get<Teacher[]>('http://localhost:2525/api/teachers');
    return this.httpClient.get<Teacher[]>('/api/teachers');

  }
  saveTeacher(teacher: Teacher): Observable<Teacher>{
    // return this.httpClient.post<Teacher>('http://localhost:2525/api/teachers',teacher);
    return this.httpClient.post<Teacher>('api/teachers',teacher);
  }
  updateTeacher(teacher: Teacher): Observable<Teacher>{
    // return this.httpClient.put<Teacher>('http://localhost:2525/api/teachers',teacher);
    return this.httpClient.put<Teacher>('api/teachers',teacher);
  }

  deleteTeacher(teacherId: number): Observable<Teacher>{
    // return this.httpClient.delete<Teacher>(`http://localhost:2525/api/teachers/${teacherId}`);
    return this.httpClient.delete<Teacher>(`/api/teachers/${teacherId}`);

  }

}
