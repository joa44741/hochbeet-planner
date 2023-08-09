import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hochbeet } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class HochbeetService {
  BASE_URI = environment.baseUrl;

  constructor(private httpClient: HttpClient) {}

  loadHochbeetList(): Observable<Hochbeet[]> {
    return this.httpClient.get<Hochbeet[]>(`${this.BASE_URI}/hochbeete`);

    // return this.plantsService.loadPlants().pipe(
    //   map((plants) => {
    //     const brokkoli = plants.find((p) => p.plantName === 'Brokkoli')!;
    //     const basilikum = plants.find((p) => p.plantName === 'Basilikum')!;
    //     const hochbeetList: Hochbeet[] = [
    //       {
    //         beetNumber: 1,
    //         name: 'Beet 1 (links)',
    //         width: 185,
    //         height: 85,
    //         plantsInBeet: [
    //           { plant: brokkoli, plantNumber: 1, position: { x: 0, y: 0 } },
    //           { plant: basilikum, plantNumber: 1, position: { x: 100, y: 10 } }
    //         ]
    //       }
    //     ];
    //     return hochbeetList;
    //   })
    // );
  }
}
