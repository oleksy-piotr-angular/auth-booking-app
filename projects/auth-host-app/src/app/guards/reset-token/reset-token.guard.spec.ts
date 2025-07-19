import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { resetTokenGuard } from './reset-token.guard';

describe('resetTokenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => resetTokenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
