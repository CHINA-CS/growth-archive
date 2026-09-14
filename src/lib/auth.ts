import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const COOKIE_NAME = "portfolio_admin";

export function checkPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

export async function isAdmin() {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    return token === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: ADMIN_PASSWORD,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  };
}

export { ADMIN_PASSWORD, COOKIE_NAME };
