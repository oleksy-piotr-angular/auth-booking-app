import { TestBed, inject } from '@angular/core/testing';
import { InjectionToken, Injector } from '@angular/core';
import { AUTH_API_BASE } from './tokens';

describe('AUTH_API_BASE token', () => {
  it('should be defined as an InjectionToken<string>', () => {
    // It exists
    expect(AUTH_API_BASE).toBeDefined();

    // It really is an InjectionToken
    expect(AUTH_API_BASE instanceof InjectionToken).toBeTrue();

    // Its toString() returns the human‐readable key
    expect(AUTH_API_BASE.toString()).toBe('InjectionToken AUTH_API_BASE');
  });
});

describe('AUTH_API_BASE injection', () => {
  const TEST_URL = 'https://api.example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // provide a mock/base URL for the token
        { provide: AUTH_API_BASE, useValue: TEST_URL },
      ],
    });
  });

  it('should inject the provided value via TestBed.inject()', () => {
    const base = TestBed.inject<string>(AUTH_API_BASE);
    expect(base).toBe(TEST_URL);
  });

  it('should also inject via the raw Injector', () => {
    const injector = TestBed.inject(Injector);
    const base2 = injector.get<string>(AUTH_API_BASE);
    expect(base2).toBe(TEST_URL);
  });
});
