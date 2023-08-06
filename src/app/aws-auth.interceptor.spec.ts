import { TestBed } from '@angular/core/testing';

import { AwsAuthInterceptor } from './aws-auth.interceptor';

describe('AwsAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AwsAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AwsAuthInterceptor = TestBed.inject(AwsAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
