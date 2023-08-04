import { createReducer, on } from '@ngrx/store';
import { Hochbeet, Plant } from '../secure/types';
import { HochbeetApiActions } from './hochbeet.actions';

export interface HochbeetState {
  hochbeetList: Hochbeet[];
  selectedHochbeet?: Hochbeet;
}
export const initialState: Readonly<HochbeetState> = {
  hochbeetList: []
};

export const hochbeetReducer = createReducer(
  initialState,
  on(
    HochbeetApiActions.retrievedHochbeetList,
    (state: HochbeetState, { hochbeetList }): Readonly<HochbeetState> => ({
      ...state,
      hochbeetList: [...hochbeetList]
    })
  )
);
