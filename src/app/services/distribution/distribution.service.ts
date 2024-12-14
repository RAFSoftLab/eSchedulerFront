import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Teacher} from '../../models/teacher.model';
import {Distribution} from '../../models/distribution.model';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  constructor(private httpClient:HttpClient) { }

  getDistributions(): Observable<Distribution[]>{
    return this.httpClient.get<Distribution[]>('http://localhost:8080/api/distributions');
  }

  updateDistribution(distribution: Distribution): Observable<Distribution>{
    return this.httpClient.put<Distribution>('http://localhost:8080/api/distributions', distribution);
  }

  saveDistribution(distribution: Distribution): Observable<Distribution>{
    return this.httpClient.post<Distribution>('http://localhost:8080/api/distributions', distribution);
  }

  deleteDistribution(id: number): Observable<any>{
    return this.httpClient.delete('http://localhost:8080/api/distributions/' + id);
  }

}
