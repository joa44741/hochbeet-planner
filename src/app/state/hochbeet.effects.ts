import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';

import { HochbeetService } from '../hochbeet-drag-and-drop/services/hochbeet.service';
import { HochbeetAction, HochbeetApiActions } from './hochbeet.actions';

export const loadHochbeeteEffect = createEffect(
  (actions$ = inject(Actions), hochbeetService = inject(HochbeetService)) => {
    return actions$.pipe(
      ofType(HochbeetAction.loadHochbeete),
      exhaustMap(() =>
        hochbeetService.loadHochbeetList().pipe(
          map((hochbeetList) =>
            HochbeetApiActions.retrievedHochbeetList({ hochbeetList })
          )
          //   catchError((error: { message: string }) =>
          //     of(
          //       ActorsApiActions.actorsLoadedFailure({ errorMsg: error.message })
          //     )
          //   )
        )
      )
    );
  },
  { functional: true }
);
export const saveHochbeetEffect = createEffect(
  (actions$ = inject(Actions), hochbeetService = inject(HochbeetService)) => {
    return actions$.pipe(
      ofType(HochbeetAction.saveHochbeet),
      exhaustMap((action) =>
        hochbeetService
          .storeHochbeet(action.hochbeet)
          .pipe(map(() => HochbeetApiActions.storedHochbeet()))
      )
    );
  },
  { functional: true }
);
