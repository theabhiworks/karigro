import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

type UserForSession = {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "WORKER" | "ADMIN";
};

export type SessionPayload = {
  userId: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "WORKER" | "ADMIN";
};

export async function createSessionToken(
  user: UserForSession
): Promise<string> {
  return await new SignJWT({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    if (
      typeof payload.userId !== "number" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "CUSTOMER" &&
        payload.role !== "WORKER" &&
        payload.role !== "ADMIN")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}