import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plant } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {
  BASE_URI = environment.baseUrl;
  constructor(private httpClient: HttpClient) {}

  loadPlants(): Observable<Plant[]> {
    return this.httpClient.get<Plant[]>(`${this.BASE_URI}/plants`);
    //.pipe(
    // switchMap((plants) => {
    //   return plants;
    // })
    //);
  }
}
