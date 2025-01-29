import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {ResponseDTO} from '../../response/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient:HttpClient) { }

  getUser(email: string, password:string): Observable<ResponseDTO<String>>{
    const body = {email,password};
    // return this.httpClient.post<ResponseDTO<String>>('http://localhost:2525/api/users/information', body);
    return this.httpClient.post<ResponseDTO<String>>('/api/users/information', body);

  }
}
