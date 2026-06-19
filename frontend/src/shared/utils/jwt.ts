import { AUTH_ROLES, type AuthRole } from "../types/auth";

interface JwtPayload {
  email?: unknown;
  sub?: unknown;
  role?: unknown;
  exp?: unknown;
}

export interface DecodedJwt {
  email: string;
  role: AuthRole;
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function isAuthRole(value: unknown): value is AuthRole {
  return typeof value === "string" && AUTH_ROLES.includes(value as AuthRole);
}

export function decodeJwt(token: string): DecodedJwt {
  const [, payloadSegment] = token.split(".");

  if (!payloadSegment) {
    throw new Error("Invalid token.");
  }

  let payload: JwtPayload;

  try {
    payload = JSON.parse(decodeBase64Url(payloadSegment)) as JwtPayload;
  } catch {
    throw new Error("Invalid token.");
  }

  const email = typeof payload.email === "string" ? payload.email : payload.sub;

  if (typeof email !== "string" || !email) {
    throw new Error("Invalid token.");
  }

  if (!isAuthRole(payload.role)) {
    throw new Error("Invalid token.");
  }

  if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
    throw new Error("Expired token.");
  }

  return {
    email,
    role: payload.role,
  };
}
