"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in the environment..");
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(data: { userId: string; token: string }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ data, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "strict",
    path: "/",
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

type SessionPayload = {
  data: { userId: string; token: string };
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string) {
  try {
    const sessionToken = session;

    if (!sessionToken) {
      console.error("Session token is missing. Did you create a session?");
      return;
    }

    const { payload }: { payload: SessionPayload } = await jwtVerify(
      sessionToken,
      encodedKey,
      {
        algorithms: ["HS256"],
      }
    );

    return payload;
  } catch (err) {
    console.error("Failed to verify session", err);
  }
}

export async function getSessionData() {
  const sessionToken = (await cookies()).get("session")?.value as string;
  const payload = (await decrypt(sessionToken)) as unknown as SessionPayload;

  return payload;
}
