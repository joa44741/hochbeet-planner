import { createReducer, on } from '@ngrx/store';
import { Hochbeet } from '../types';
import { HochbeetAction, HochbeetApiActions } from './hochbeet.actions';

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
  ),
  on(
    HochbeetAction.createHochbeet,
    (state: HochbeetState, { hochbeet }): Readonly<HochbeetState> => ({
      ...state,
      hochbeetList: [...state.hochbeetList, hochbeet]
    })
  )
);
