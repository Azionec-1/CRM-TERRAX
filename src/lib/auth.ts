import { jwtVerify, SignJWT } from "jose";

export const AUTH_COOKIE = "terrax_session";
const DEFAULT_SECRET = "local-dev-secret-change-me";

export type SessionPayload = {
  sub: string;
  email: string;
  role: "ADMIN" | "SALES";
};

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as SessionPayload;
}
