import { PlantInBeet, Warning, WarningReason } from '../types';

export const sortPlantsInBeet = (a: PlantInBeet, b: PlantInBeet) =>
  (a.plant.name + a.plantNumber).localeCompare(b.plant.name + b.plantNumber);

export const createWarning = (
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
export const notEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => {
  return value !== null && value !== undefined;
};

export const plantInBeetEqual = (plant1: PlantInBeet, plant2: PlantInBeet) => {
  return (
    plant1.plant.name === plant2.plant.name &&
    plant1.plantNumber === plant2.plantNumber
  );
};

export const isPlantInBeetIncluded = (
  plantInBeetToFind: PlantInBeet,
  plantsInBeet: PlantInBeet[]
) => {
  return (
    plantsInBeet.findIndex((plantInBeet) =>
      plantInBeetEqual(plantInBeet, plantInBeetToFind)
    ) >= 0
  );
};

export const plantsInBeetEqual = (
  plants1: PlantInBeet[],
  plants2: PlantInBeet[]
) => {
  if (plants1.length !== plants2.length) {
    return false;
  } else {
    plants1.sort(sortPlantsInBeet);
    plants2.sort(sortPlantsInBeet);

    for (let index = 0; index < plants1.length; index++) {
      const p1 = plants1[index];
      const p2 = plants2[index];
      if (!plantInBeetEqual(p1, p2)) {
        return false;
      }
    }
    return true;
  }
};
