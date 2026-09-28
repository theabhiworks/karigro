import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get("karigro_session")?.value;

  if (!token) {
    return null;
  }

  return await verifySessionToken(token);
}