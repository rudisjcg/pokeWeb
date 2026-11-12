import { SignJWT, generateKeyPair } from "jose";
import { beforeAll, describe, expect, it } from "vitest";
import { createVerifier, type TokenVerifier } from "./auth";

const ISSUER = "https://project.supabase.co/auth/v1";
const USER_ID = "6f1c2f0e-8a57-4c8e-9b0a-2f7f3c1d9e11";

type Keys = Awaited<ReturnType<typeof generateKeyPair>>;

let keys: Keys;
let otherKeys: Keys;
let verify: TokenVerifier;

function sign(
  privateKey: Keys["privateKey"],
  overrides: { audience?: string; issuer?: string; subject?: string | null; expiresIn?: string } = {},
) {
  const jwt = new SignJWT({})
    .setProtectedHeader({ alg: "ES256" })
    .setIssuer(overrides.issuer ?? ISSUER)
    .setAudience(overrides.audience ?? "authenticated")
    .setIssuedAt()
    .setExpirationTime(overrides.expiresIn ?? "5m");
  if (overrides.subject !== null) jwt.setSubject(overrides.subject ?? USER_ID);
  return jwt.sign(privateKey);
}

beforeAll(async () => {
  keys = await generateKeyPair("ES256");
  otherKeys = await generateKeyPair("ES256");
  verify = createVerifier(keys.publicKey, ISSUER);
});

describe("createVerifier", () => {
  it("returns the user id for a valid token", async () => {
    await expect(verify(await sign(keys.privateKey))).resolves.toEqual({ userId: USER_ID });
  });

  it("rejects an expired token", async () => {
    await expect(verify(await sign(keys.privateKey, { expiresIn: "-1m" }))).resolves.toBeNull();
  });

  it("rejects a token signed with another key", async () => {
    await expect(verify(await sign(otherKeys.privateKey))).resolves.toBeNull();
  });

  it("rejects a token for another audience", async () => {
    await expect(verify(await sign(keys.privateKey, { audience: "anon" }))).resolves.toBeNull();
  });

  it("rejects a token from another issuer", async () => {
    await expect(
      verify(await sign(keys.privateKey, { issuer: "https://evil.example/auth/v1" })),
    ).resolves.toBeNull();
  });

  it("rejects a token without a subject", async () => {
    await expect(verify(await sign(keys.privateKey, { subject: null }))).resolves.toBeNull();
  });

  it("rejects text that is not a JWT", async () => {
    await expect(verify("not-a-token")).resolves.toBeNull();
    await expect(verify("")).resolves.toBeNull();
  });
});
