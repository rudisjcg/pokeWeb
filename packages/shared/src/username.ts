export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

export type UsernameValidation =
  | { ok: true; username: string }
  | { ok: false; reason: "length" | "chars" };

export function validateUsername(value: string): UsernameValidation {
  const username = value.trim();
  if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    return { ok: false, reason: "length" };
  }
  if (!/^[A-Za-z0-9_]+$/.test(username)) {
    return { ok: false, reason: "chars" };
  }
  return { ok: true, username };
}
