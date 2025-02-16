import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Hochbeet, PlantInBeet } from '../../../../shared/types';

// export const PlantsActions = createActionGroup({
//     source: 'Plants',
//     events: {
//       'Add Plant': props<{ bookId: string }>(),
//       'Remove Plant': props<{ bookId: string }>(),
//     },
//   });

export const HochbeetAction = createActionGroup({
  source: 'Hochbeet',
  events: {
    'Add Plant': props<{ plantInBeet: PlantInBeet }>(),
    'Remove Plant': props<{ plantInBeet: PlantInBeet }>(),
    'Create Hochbeet': props<{ hochbeet: Hochbeet }>(),
    'Save Hochbeet': props<{ hochbeet: Hochbeet }>(),
    'Load Hochbeete': emptyProps()
  }
});

export const HochbeetApiActions = createActionGroup({
  source: 'Hochbeet API',
  events: {
    'Set Loading': props<{ isLoading: boolean }>(),
    'Store Hochbeet': props<{ hochbeet: Hochbeet }>(),
    'Stored Hochbeet': emptyProps(),
    'Retrieved Hochbeet List': props<{
      hochbeetList: ReadonlyArray<Hochbeet>;
    }>(),
    'Retrieved Single Hochbeet': props<{ hochbeet: Readonly<Hochbeet> }>()
  }
});
