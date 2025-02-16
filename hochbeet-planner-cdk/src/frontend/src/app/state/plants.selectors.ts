import { createFeatureSelector } from '@ngrx/store';
import { Plant } from '../../../../shared/types';

export const selectPlants =
  createFeatureSelector<ReadonlyArray<Plant>>('plants');
