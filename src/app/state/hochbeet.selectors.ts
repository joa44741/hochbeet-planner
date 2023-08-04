import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HochbeetState } from './hochbeet.reducer';

export const selectHochbeetState =
  createFeatureSelector<Readonly<HochbeetState>>('hochbeetState');

export const selectHochbeetList = createSelector(
  selectHochbeetState,
  (state: Readonly<HochbeetState>) => {
    console.log('state', { state });
    return state.hochbeetList;
  }
);

export const selectSelectedHochbeet = createSelector(
  selectHochbeetState,
  (state: Readonly<HochbeetState>) => state.selectedHochbeet
);
