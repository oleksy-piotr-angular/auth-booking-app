// projects/_shell-app/src/app/shared/utils/jwt.util.spec.ts
import { isTokenExpired } from './jwt.util';

describe('isTokenExpired (TDD)', () => {
  const future = () => Math.floor(Date.now() / 1000) + 3600;
  const past = () => Math.floor(Date.now() / 1000) - 3600;

  function createToken(payloadObj: any): string {
    const payload = btoa(JSON.stringify(payloadObj));
    return `header.${payload}.sig`;
  }

  it('should return false if exp is in the future', () => {
    expect(isTokenExpired(createToken({ exp: future() }))).toBeFalse();
  });

  it('should return true if exp is in the past', () => {
    expect(isTokenExpired(createToken({ exp: past() }))).toBeTrue();
  });

  it('should return true if token is malformed', () => {
    expect(isTokenExpired('invalid.token.structure')).toBeTrue();
  });

  it('should return true if exp is missing', () => {
    expect(isTokenExpired(createToken({ foo: 'bar' }))).toBeTrue();
  });
});
