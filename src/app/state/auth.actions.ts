import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthAction = createActionGroup({
  source: 'Auth',
  events: {
    loggedIn: emptyProps(),
    loggingOut: emptyProps() // save everything before logged out
  }
});
