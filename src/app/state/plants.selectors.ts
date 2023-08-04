import { createFeatureSelector } from '@ngrx/store';
import { Plant } from '../secure/types';

export const selectPlants =
  createFeatureSelector<ReadonlyArray<Plant>>('plants');
