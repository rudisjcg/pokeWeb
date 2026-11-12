import { createRemoteJWKSet, jwtVerify, type CryptoKey, type JWTVerifyGetKey } from "jose";

export type TokenVerifier = (token: string) => Promise<{ userId: string } | null>;

/**
 * Verifies Supabase session tokens against the given key(s). Resolves to null
 * for anything that is not a currently valid token of a signed-in user.
 */
export function createVerifier(keys: JWTVerifyGetKey | CryptoKey, issuer: string): TokenVerifier {
  return async (token) => {
    try {
      const options = { issuer, audience: "authenticated" };
      const { payload } =
        typeof keys === "function" ? await jwtVerify(token, keys, options) : await jwtVerify(token, keys, options);
      return payload.sub ? { userId: payload.sub } : null;
    } catch {
      return null;
    }
  };
}

/** Verifier for a Supabase project, using the signing keys it publishes. */
export function createSupabaseVerifier(supabaseUrl: string): TokenVerifier {
  const base = supabaseUrl.replace(/\/+$/, "");
  const jwks = createRemoteJWKSet(new URL(`${base}/auth/v1/.well-known/jwks.json`));
  return createVerifier(jwks, `${base}/auth/v1`);
}
