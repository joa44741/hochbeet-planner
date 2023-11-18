import { Injectable } from '@angular/core';
import { Plant, PlantInBeet, Warning, WarningReason } from '../../types';
import {
  isPlantInBeetIncluded,
  notEmpty,
  plantInBeetEqual,
  sortPlantsInBeet
} from '../plant-in-beet-util';

const createWarning = (
  reason: WarningReason,
  affectedPlants: PlantInBeet[],
  updatedPlantInBeet: PlantInBeet
): Warning => {
  const sortedPlants = affectedPlants
    .concat(updatedPlantInBeet)
    .sort(sortPlantsInBeet);
  return {
    affectedPlants: sortedPlants,
    warningReason: reason
  };
};

@Injectable({
  providedIn: 'root'
})
export class CollisionDetectorService {
  warnings: Record<number, Warning[]> = [];

  private detectCollision(
    loadedPlants: Record<string, Plant>,
    p1: PlantInBeet,
    p2: PlantInBeet,
    sizeFactor: number
  ) {
    const plant1 = loadedPlants[p1.plantName];
    const plant2 = loadedPlants[p2.plantName];
    const p1Right = p1.position.x + plant1.width * sizeFactor;
    const p2Right = p2.position.x + plant2.width * sizeFactor;
    const p1Bottom = p1.position.y + plant1.height * sizeFactor;
    const p2Bottom = p2.position.y + plant2.height * sizeFactor;

    return (
      p1.position.x < p2Right &&
      p1Right > p2.position.x &&
      p1.position.y < p2Bottom &&
      p1Bottom > p2.position.y
    );
  }

  updateWarnings(
    beetNumber: number,
    loadedPlants: Record<string, Plant>,
    plantsInBeet: PlantInBeet[],
    sizeFactor: number
  ) {
    const tempWarnings: Warning[] = [];
    for (const plantInBeetToCheck of plantsInBeet) {
      const plantsWithCollisions: PlantInBeet[] = [];

      for (const otherPlantInBeet of plantsInBeet) {
        if (plantInBeetEqual(plantInBeetToCheck, otherPlantInBeet)) {
          // don't check the same plant in beet
          continue;
        }

        if (
          this.detectCollision(
            loadedPlants,
            plantInBeetToCheck,
            otherPlantInBeet,
            sizeFactor
          )
        ) {
          plantsWithCollisions.push(otherPlantInBeet);
        }
      }

      if (plantsWithCollisions.length === 0) {
        continue;
      }

      tempWarnings.push(
        createWarning('COLLISION', plantsWithCollisions, plantInBeetToCheck)
      );
    }

    // delete duplicates
    let warningsForUpdate: Warning[] = [];
    for (const warning of tempWarnings) {
      const indexOfWarningThatContainsAllPlants = warningsForUpdate.findIndex(
        (w2) =>
          w2.warningReason === warning.warningReason &&
          warning.affectedPlants.every((p1) =>
            isPlantInBeetIncluded(p1, w2.affectedPlants)
          )
      );
      if (indexOfWarningThatContainsAllPlants === -1) {
        // there is no warning in the update list that contains all affected plants
        // check if there are some that need to be deleted now, because all of the plants are in the new one available
        const idxToDelete = warningsForUpdate
          .map((maybeOutdatedWarning, idx) => {
            const indexOfOutdatedWarningThatContainsAllPlants =
              maybeOutdatedWarning.affectedPlants.every((p) =>
                isPlantInBeetIncluded(p, warning.affectedPlants)
              );
            if (indexOfOutdatedWarningThatContainsAllPlants) {
              return idx;
            } else {
              return undefined;
            }
          })
          .filter(notEmpty);
        warningsForUpdate = warningsForUpdate.filter(
          (_, idx) => !idxToDelete.includes(idx)
        );
        warningsForUpdate.push(warning);
      }
    }
    this.warnings[beetNumber] = warningsForUpdate;
  }
}
