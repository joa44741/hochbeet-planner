import { TestBed } from '@angular/core/testing';

import { Plant, PlantInBeet } from '../../../../../shared/types';
import { CollisionDetectorService } from './collision-detector.service';

const brokkoli: Plant = {
  name: 'Brokkoli',
  group: 'Kreuzblütler',
  feeder: 'STRONG',
  height: 50,
  width: 50,
  badNeighbors: []
};
const basilikum: Plant = {
  name: 'Basilikum',
  group: 'Kreuzblütler',
  feeder: 'WEAK',
  height: 20,
  width: 20,
  badNeighbors: []
};

const sortIt = (a: PlantInBeet, b: PlantInBeet) => {
  return (a.plant.name + a.plantNumber).localeCompare(
    b.plant.name + b.plantNumber
  );
};

describe('CollisionDetectorService', () => {
  let service: CollisionDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollisionDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('detect collision 1', () => {
    const brokkoli1: PlantInBeet = {
      plantNumber: 1,
      position: { x: 10, y: 10 },
      plant: brokkoli
    };
    const basilikum1: PlantInBeet = {
      plantNumber: 1,
      position: { x: 5, y: 10 },
      plant: basilikum
    };
    expect(service.detectCollision(brokkoli1, basilikum1, 1)).toBeTrue();
  });

  it('detect no collision', () => {
    const brokkoli1: PlantInBeet = {
      plantNumber: 1,
      position: { x: 0, y: 0 },
      plant: brokkoli
    };
    const brokkoli2: PlantInBeet = {
      plantNumber: 2,
      position: { x: 50, y: 0 },
      plant: basilikum
    };
    expect(service.detectCollision(brokkoli1, brokkoli2, 1)).toBeFalse();
  });

  it('update warnings', () => {
    const sizeFactor = 1;
    const brokkoli1: PlantInBeet = {
      plantNumber: 1,
      position: { x: 0, y: 0 },
      plant: brokkoli
    };
    const basilikum1: PlantInBeet = {
      plantNumber: 1,
      position: { x: 0, y: 0 },
      plant: basilikum
    };
    const basilikum2: PlantInBeet = {
      plantNumber: 1,
      position: { x: 5, y: 0 },
      plant: basilikum
    };
    const plantsInBeet = [brokkoli1, basilikum1, basilikum2];
    service.updateWarnings(plantsInBeet, sizeFactor);
    expect(service.warnings).toEqual([
      {
        affectedPlants: plantsInBeet.sort(sortIt),
        warningReason: 'COLLISION'
      }
    ]);
    brokkoli1.position.y = 100;
    service.updateWarnings(plantsInBeet, sizeFactor);
    expect(service.warnings.length).toEqual(1);
    // expect(service.updateWarnings(brokkoli1, plantsInBeet, 1)).toBeFalse();
  });
});
