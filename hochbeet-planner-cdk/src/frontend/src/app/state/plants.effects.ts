import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { PlantsService } from '../hochbeet-drag-and-drop/services/plants.service';
import { HochbeetAction } from './hochbeet.actions';
import { PlantsActions, PlantsApiActions } from './plants.actions';

export const loadPlantsEffect = createEffect(
  (
    actions$ = inject(Actions),
    plantsService = inject(PlantsService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(PlantsActions.loadPlants),
      exhaustMap((action) => {
        return plantsService.loadPlants().pipe(
          map((plants) => PlantsApiActions.retrievedPlantsList({ plants })),
          tap(() => {
            if (action.loggedIn) {
              store.dispatch(HochbeetAction.loadHochbeete());
            }
          })
        );
      })
    );
  },
  { functional: true }
);
