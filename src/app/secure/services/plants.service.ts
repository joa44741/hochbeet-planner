import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Plant } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {
  loadPlants(): Observable<Plant[]> {
    const brokkoli: Plant = {
      name: 'Brokkoli',
      group: 'Kreuzblütler',
      feeder: 'STRONG',
      height: 50,
      width: 50,
      badNeighbors: [],
      imageUrl:
        'https://pixabay.com/get/g19073f0fa0238b65638660a30348e87515bb937e5591acb7cf40db3580915c5808db126167f82579b3fc6888e44c001e_640.png'
    };
    const basilikum: Plant = {
      name: 'Basilikum',
      group: 'Kreuzblütler',
      feeder: 'WEAK',
      height: 20,
      width: 20,
      badNeighbors: [],
      imageUrl:
        'https://ultimagardening.com/wp-content/uploads/2021/10/05-Ultima-Gardening-Nursery-Shop-Money-Plant-Green-68.png'
      //'https://pixabay.com/get/g365bf30dc44faf500dc17baf1415067eb08d41a6ea89e2915430dd9a20a2c71a51082ffb92b73b55c229b81266577b76_640.png'
    };

    return of([brokkoli, basilikum]);
  }
}
