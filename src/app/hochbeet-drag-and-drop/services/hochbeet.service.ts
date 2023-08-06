import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Hochbeet } from '../../types';
import { PlantsService } from './plants.service';

@Injectable({
  providedIn: 'root'
})
export class HochbeetService {
  constructor(private plantsService: PlantsService) {}

  loadHochbeetList(): Observable<Hochbeet[]> {
    return this.plantsService.loadPlants().pipe(
      map((plants) => {
        const brokkoli = plants.find((p) => p.name === 'Brokkoli')!;
        const basilikum = plants.find((p) => p.name === 'Basilikum')!;
        const hochbeetList: Hochbeet[] = [
          {
            beetNumber: 1,
            name: 'Beet 1 (links)',
            width: 185,
            height: 85,
            plantsInBeet: [
              { plant: brokkoli, plantNumber: 1, position: { x: 0, y: 0 } },
              { plant: basilikum, plantNumber: 1, position: { x: 100, y: 10 } }
            ]
          }
        ];
        return hochbeetList;
      })
    );
  }
}
