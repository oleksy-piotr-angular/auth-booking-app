// projects/auth/src/lib/utils/jwt.utils.ts
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    // malformed if not three segments
    if (parts.length !== 3) {
      return true;
    }

    const payload = JSON.parse(atob(parts[1]));

    // missing or invalid exp → treat as expired
    if (typeof payload.exp !== 'number') {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    // any parse error → expire
    return true;
  }
}
