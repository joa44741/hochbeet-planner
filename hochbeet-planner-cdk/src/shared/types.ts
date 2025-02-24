export type FeederType = 'WEAK' | 'MEDIUM' | 'STRONG';

export interface Plant {
  userId: string;
  plantName: string;
  group: string;
  width: number;
  height: number;
  feeder: FeederType;
  badNeighbors: Plant[];
  imageUrl?: string;
}

export interface PlantInBeet {
  plantNumber: number;
  position: {
    x: number;
    y: number;
  };
  plantName: string;
  selected?: boolean;
}

export interface Hochbeet {
  userId: string;
  beetNumber: number;
  name: string;
  plantsInBeet: PlantInBeet[];
  height: number;
  width: number;
}

export type WarningReason = 'COLLISION' | 'MISCHKULTUR' | 'FEEDER';

export interface Warning {
  affectedPlants: PlantInBeet[];
  warningReason: WarningReason;
}
