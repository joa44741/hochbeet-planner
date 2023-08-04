import { createActionGroup, props } from '@ngrx/store';
import { Plant } from '../secure/types';

// export const PlantsActions = createActionGroup({
//     source: 'Plants',
//     events: {
//       'Add Plant': props<{ bookId: string }>(),
//       'Remove Plant': props<{ bookId: string }>(),
//     },
//   });

export const PlantsApiActions = createActionGroup({
  source: 'Plants API',
  events: {
    'Retrieved Plants List': props<{ plants: ReadonlyArray<Plant> }>()
  }
});
