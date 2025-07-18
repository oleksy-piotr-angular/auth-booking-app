// jwt.util.ts
export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}
