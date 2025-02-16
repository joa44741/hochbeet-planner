import { createReducer, on } from '@ngrx/store';
import { Hochbeet } from '../../../../shared/types';
import { HochbeetAction, HochbeetApiActions } from './hochbeet.actions';

export interface HochbeetState {
  isLoading: boolean;
  hochbeetList: Hochbeet[];
  selectedHochbeet?: Hochbeet;
}
export const initialState: Readonly<HochbeetState> = {
  isLoading: false,
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
  ),
  on(
    HochbeetApiActions.setLoading,
    (state: HochbeetState, { isLoading }): Readonly<HochbeetState> => ({
      ...state,
      isLoading
    })
  )
);
