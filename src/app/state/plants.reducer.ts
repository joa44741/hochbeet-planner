import { createReducer, on } from '@ngrx/store';
import { Plant } from '../secure/types';
import { PlantsApiActions } from './plants.actions';

export const initialState: ReadonlyArray<Plant> = [];
export const plantsReducer = createReducer(
  initialState,
  on(
    PlantsApiActions.retrievedPlantsList,
    (_state, { plants }): ReadonlyArray<Plant> => plants
  )
);
