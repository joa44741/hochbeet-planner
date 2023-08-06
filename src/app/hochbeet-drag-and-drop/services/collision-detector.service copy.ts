import { Injectable } from '@angular/core';
import { PlantInBeet, Warning, WarningReason } from '../../types';
import {
  isPlantInBeetIncluded,
  plantInBeetEqual,
  plantsInBeetEqual,
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
  warnings: Warning[] = [];

  public detectCollision(p1: PlantInBeet, p2: PlantInBeet, sizeFactor: number) {
    const p1Right = p1.position.x + p1.plant.width * sizeFactor;
    const p2Right = p2.position.x + p2.plant.width * sizeFactor;
    const p1Bottom = p1.position.y + p1.plant.height * sizeFactor;
    const p2Bottom = p2.position.y + p2.plant.height * sizeFactor;

    return (
      p1.position.x < p2Right &&
      p1Right > p2.position.x &&
      p1.position.y < p2Bottom &&
      p1Bottom > p2.position.y
    );
  }

  updateWarnings(
    updatedPlantInBeet: PlantInBeet,
    plantsInBeet: PlantInBeet[],
    sizeFactor: number
  ) {
    const otherAffectedPlantsInBeet = plantsInBeet.filter((plantInBeet) => {
      return (
        plantInBeet !== updatedPlantInBeet &&
        this.detectCollision(plantInBeet, updatedPlantInBeet, sizeFactor)
      );
    });

    const arePlantsAffected = otherAffectedPlantsInBeet.length > 0;

    // get existing warnings + index that (previously) were related to the updated plant
    const plantsToCheckAgain: PlantInBeet[] = [];
    const warningIndexesToDelete: number[] = [];

    for (const [idx, warning] of this.warnings.entries()) {
      if (warning.warningReason !== 'COLLISION') {
        // TODO: does it work with filters or is index than different?
        continue;
      }

      const isUpdatedPlantInWarning = isPlantInBeetIncluded(
        updatedPlantInBeet,
        warning.affectedPlants
      );

      if (isUpdatedPlantInWarning) {
        if (arePlantsAffected) {
          const affectedPlantsIncludingUpdatedOne =
            otherAffectedPlantsInBeet.concat(updatedPlantInBeet);
          // updated plant was affected and this is still the case
          if (
            plantsInBeetEqual(
              affectedPlantsIncludingUpdatedOne,
              warning.affectedPlants
            )
          ) {
            // the plants are still the same as before --> ignore it
            continue;
          } else {
            // updated plant was affected and is still affected but not the same as before
            // search for previously affected plants that are not affected by the updated one
            const notAffectedPlants = warning.affectedPlants.filter(
              (previouslyAffectedPlant) =>
                !isPlantInBeetIncluded(
                  previouslyAffectedPlant,
                  affectedPlantsIncludingUpdatedOne
                )
            );
            plantsToCheckAgain.push(...notAffectedPlants);
          }
        } else {
          // updated plant is in warning, but now no other plants are affected by it
          // --> if there was only 1 other plant it can be deleted now, otherwise the other plants need to be checked again
          if (warning.affectedPlants.length === 2) {
            warningIndexesToDelete.push(idx);
          } else if (warning.affectedPlants.length > 2) {
            plantsToCheckAgain.push(
              ...warning.affectedPlants.filter(
                (affectedPlant) =>
                  !plantInBeetEqual(affectedPlant, updatedPlantInBeet)
              )
            );
          } else {
            throw new Error('something strange');
          }
        }
      } else {
        // Plant was not in warnings, can be ignored
        continue;
      }
    }
    // const warningsAndIndexes = this.warnings
    //   .map((warning, idx) => {
    //     if (warning.warningReason !== 'COLLISION') {
    //       return undefined;
    //     }
    //     if (
    //       warning.affectedPlants.find((affectedPlant) =>
    //         this.plantInBeetEqual(affectedPlant, updatedPlantInBeet)
    //       )
    //     ) {
    //       return { warning, idx };
    //     }
    //   })
    //   .filter(notEmpty);

    // warningsAndIndexes.filter((warningAndIndex) => {
    //   const otherPlants = warningAndIndex.warning.affectedPlants.filter(
    //     (affectedPlant) =>
    //       !this.plantInBeetEqual(affectedPlant, updatedPlantInBeet)
    //   );

    //   if(otherPlants.length === 1)
    // });

    // const indexesOfWarningsToDelete = this.warnings
    //   .map((warning, idx) => {
    //     // check only for collisions here
    //     if (warning.warningReason !== 'COLLISION') {
    //       return undefined;
    //     }

    //     const updatedPlantPreviouslyAffected = warning.affectedPlants.find(
    //       (affectedPlant) =>
    //         this.plantInBeetEqual(affectedPlant, updatedPlantInBeet)
    //     );

    //     if (
    //       updatedPlantPreviouslyAffected &&
    //       warning.affectedPlants !== newWarning.affectedPlants
    //     ) {
    //       return idx;
    //     } else {
    //       return undefined;
    //     }
    //   })
    //   .filter(notEmpty);

    const updatedWarnings = this.warnings.filter(
      (_, idx) => !warningIndexesToDelete.includes(idx)
    );

    if (arePlantsAffected) {
      const newWarning = createWarning(
        'COLLISION',
        otherAffectedPlantsInBeet,
        updatedPlantInBeet
      );

      if (!updatedWarnings.includes(newWarning)) {
        updatedWarnings.push(newWarning);
      }
    }
    this.warnings = updatedWarnings;
    // cleanup not valid warnings
    console.log('update also', { plantsToCheckAgain });
    for (const plantToCheck of plantsToCheckAgain) {
      this.updateWarnings(plantToCheck, plantsInBeet, sizeFactor);
    }
  }
}
