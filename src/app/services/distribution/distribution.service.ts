import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Teacher} from '../../models/teacher.model';
import {Distribution} from '../../models/distribution.model';
import {standardUser} from '../../models/standardUser.model';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  constructor(private httpClient:HttpClient) { }

  getDistributions(): Observable<Distribution[]>{
    return this.httpClient.get<Distribution[]>('http://localhost:2525/api/distributions');
  }

  updateDistribution(distribution: Distribution): Observable<Distribution>{
    return this.httpClient.put<Distribution>('http://localhost:2525/api/distributions', distribution);
  }

  saveDistribution(distribution: Distribution): Observable<Distribution>{
    return this.httpClient.post<Distribution>('http://localhost:2525/api/distributions', distribution);
  }

  deleteDistribution(id: number): Observable<any>{
    return this.httpClient.delete('http://localhost:2525/api/distributions/' + id);
  }

  getStandardUser(email: String): Observable<standardUser[]>{
    return this.httpClient.get<standardUser[]>('http://localhost:2525/api/distributions/' +email);
  }


}
