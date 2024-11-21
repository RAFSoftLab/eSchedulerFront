import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../Models/user.model';
import {ResponseDTO} from '../../response/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient:HttpClient) { }

  getUser(email: string): Observable<ResponseDTO<User>>{
    const params = new HttpParams().set('email', email);
    return this.httpClient.get<ResponseDTO<User>>('http://localhost:8080/api/users/information',{params});
  }
}
