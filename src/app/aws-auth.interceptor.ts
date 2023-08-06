import { HttpInterceptorFn } from '@angular/common/http';
import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';

import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const awsAuthInterceptor: HttpInterceptorFn = (req, next) => {
  return from(Auth.currentAuthenticatedUser()).pipe(
    switchMap((user: CognitoUser) => {
      const token = user.getSignInUserSession()?.getIdToken()?.getJwtToken();
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: token!
        }
      });
      return next(clonedReq);
    })
  );
};
