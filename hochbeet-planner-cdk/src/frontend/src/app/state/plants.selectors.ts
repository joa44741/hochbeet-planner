import { createFeatureSelector } from '@ngrx/store';
import { Plant } from '../types';

export const selectPlants =
  createFeatureSelector<ReadonlyArray<Plant>>('plants');
