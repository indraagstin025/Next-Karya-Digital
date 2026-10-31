import { EncryptJWT, jwtDecrypt } from "jose";

// Neutral cookie name avoids exposing CMS/admin conventions in browser storage.
// __Host- enforces Secure + Path=/ + host-only binding on HTTPS deployments.
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-nk_sess" : "nk_sess";

export const SESSION_TTL_SECONDS = 8 * 60 * 60;
export const SESSION_ABSOLUTE_MAX_SECONDS = 24 * 60 * 60;
export const SESSION_REFRESH_INTERVAL_SECONDS = 60 * 60;
const CLOCK_SKEW_TOLERANCE_SECONDS = 30;

const TOKEN_ISSUER = "urn:naykon:portal";
const TOKEN_AUDIENCE = "urn:naykon:workspace";
const HKDF_SALT = new TextEncoder().encode("naykon-auth-hkdf-salt-v1");
const HKDF_SESSION_INFO = new TextEncoder().encode("naykon:session:jwe:v1");

const KNOWN_PLACEHOLDER_SECRETS = new Set([
  "generate_random_secret_key_minimum_32_characters",
  "changeme_changeme_changeme_changeme",
  "00000000000000000000000000000000",
]);

export interface SessionTokenPayload {
  sub: string;
  sv: number;
  rf: number;
  abs: number;
}

export class MissingAuthSecretError extends Error {
  constructor() {
    super(
      "AUTH_SECRET must be configured with a high-entropy value of at least 32 characters."
    );
    this.name = "MissingAuthSecretError";
  }
}

export function getValidatedAuthSecret(): string {
  const rawSecret = process.env.AUTH_SECRET?.trim();
  if (
    !rawSecret ||
    rawSecret.length < 32 ||
    KNOWN_PLACEHOLDER_SECRETS.has(rawSecret.toLowerCase()) ||
    new Set(rawSecret).size < 8
  ) {
    throw new MissingAuthSecretError();
  }
  return rawSecret;
}

async function deriveSessionEncryptionKey(): Promise<Uint8Array> {
  const secret = getValidatedAuthSecret();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    "HKDF",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: HKDF_SALT,
      info: HKDF_SESSION_INFO,
    },
    baseKey,
    256
  );
  return new Uint8Array(derivedBits);
}

export async function encryptSessionToken(
  payload: SessionTokenPayload
): Promise<string> {
  const key = await deriveSessionEncryptionKey();
  const nowSeconds = Math.floor(Date.now() / 1000);
  const effectiveExp = Math.min(
    nowSeconds + SESSION_TTL_SECONDS,
    payload.abs
  );

  return new EncryptJWT({
    sv: payload.sv,
    rf: payload.rf,
    abs: payload.abs,
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setSubject(payload.sub)
    .setIssuedAt(nowSeconds)
    .setExpirationTime(effectiveExp)
    .encrypt(key);
}

export async function decryptSessionToken(
  token: string | undefined
): Promise<SessionTokenPayload | null> {
  if (!token || token.length > 2048) return null;

  try {
    const key = await deriveSessionEncryptionKey();
    const nowSeconds = Math.floor(Date.now() / 1000);
    const { payload } = await jwtDecrypt(token, key, {
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
      clockTolerance: CLOCK_SKEW_TOLERANCE_SECONDS,
      contentEncryptionAlgorithms: ["A256GCM"],
      keyManagementAlgorithms: ["dir"],
    });

    if (
      typeof payload.sub !== "string" ||
      payload.sub.length < 8 ||
      payload.sub.length > 64 ||
      typeof payload.sv !== "number" ||
      !Number.isInteger(payload.sv) ||
      payload.sv < 0 ||
      typeof payload.rf !== "number" ||
      typeof payload.abs !== "number" ||
      typeof payload.iat !== "number"
    ) {
      return null;
    }

    if (
      payload.iat > nowSeconds + CLOCK_SKEW_TOLERANCE_SECONDS ||
      nowSeconds >= payload.abs
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      sv: payload.sv,
      rf: payload.rf,
      abs: payload.abs,
    };
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(maxAgeSeconds = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    priority: "high" as const,
    maxAge: maxAgeSeconds,
  };
}

export function getClearedSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };
}
