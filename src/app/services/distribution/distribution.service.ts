import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Distribution} from '../../models/distribution.model';
import {standardUser} from '../../models/standardUser.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  constructor(private httpClient:HttpClient) { }

  getDistributions(): Observable<Distribution[]>{
    return this.httpClient.get<Distribution[]>(`${environment.apiUrl}/distributions`);
  }

  updateDistribution(distribution: Distribution): Observable<Distribution>{
    return this.httpClient.put<Distribution>(`${environment.apiUrl}/distributions`, distribution);
  }

  saveDistribution(distribution: Distribution): Observable<Distribution>{
    return this.httpClient.post<Distribution>(`${environment.apiUrl}/distributions`, distribution);
  }

  deleteDistribution(id: number): Observable<any>{
    return this.httpClient.delete(`${environment.apiUrl}/distributions/` + id);
  }

  getStandardUser(email: String): Observable<standardUser[]>{
    return this.httpClient.get<standardUser[]>(`${environment.apiUrl}/distributions/` +email);
  }


  importDistributions(json: any): Observable<string> {
    return this.httpClient.post(`${environment.apiUrl}/distributions/import`, json, {
      responseType: 'text'
    });
  }

}
