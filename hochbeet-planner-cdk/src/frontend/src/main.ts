import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { Amplify } from 'aws-amplify';
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
Amplify.configure({
  Auth: {
    // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'eu-central-1:0ba1140b-3e77-4289-9259-0bdd0b1f947a',

    // (required)- Amazon Cognito Region
    region: 'eu-central-1',

    // (optional) - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: 'eu-central-1',

    // // (optional) - Amazon Cognito User Pool ID
    userPoolId: 'eu-central-1_3gJwyl0MP',

    // // (optional) - Amazon Cognito Web Client ID (26-char alphanumeric string, App client secret needs to be disabled)
    userPoolWebClientId: '7deheqlaaf0lrqijt8bmng12e1',

    oauth: {
      domain: 'hochbeet-planner.auth.eu-central-1.amazoncognito.com',
      scope: ['email', 'openid'],
      redirectSignIn: isLocalhost
        ? 'http://localhost:4200'
        : 'https://d5oh8ir5zlp84.cloudfront.net',
      redirectSignOut: isLocalhost
        ? 'http://localhost:4200'
        : 'https://d5oh8ir5zlp84.cloudfront.net',

      clientId: '1g0nnr4h99a3sd0vfs9',
      responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
});
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
