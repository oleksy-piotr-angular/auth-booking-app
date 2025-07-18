// jwt.util.spec.ts
import { isTokenExpired } from './jwt.util';

describe('isTokenExpired (TDD)', () => {
  const future = () => Math.floor(Date.now() / 1000) + 3600;
  const past = () => Math.floor(Date.now() / 1000) - 3600;

  function createToken(exp: number): string {
    const payload = { exp };
    return `header.${btoa(JSON.stringify(payload))}.sig`;
  }

  it('should return false if exp is in the future', () => {
    expect(isTokenExpired(createToken(future()))).toBeFalse();
  });

  it('should return true if exp is in the past', () => {
    expect(isTokenExpired(createToken(past()))).toBeTrue();
  });

  it('should return true if token is malformed', () => {
    expect(isTokenExpired('invalid.token.structure')).toBeTrue();
  });
});
