import { strings } from "./strings";

type AuthErrorLike = { code?: string; message: string };

const messagesByCode: Record<string, string> = {
  invalid_credentials: strings.auth.invalidCredentials,
  user_already_exists: strings.auth.userExists,
  email_exists: strings.auth.userExists,
  weak_password: strings.auth.weakPassword,
  email_not_confirmed: strings.auth.emailNotConfirmed,
};

/** Text safe to show a user for a Supabase auth error; never echoes the raw error. */
export function authErrorMessage(error: AuthErrorLike): string {
  const known = error.code ? messagesByCode[error.code] : undefined;
  if (known) return known;

  // The only step of sign-up that touches our tables is the profile trigger,
  // and the only way it fails is a username someone else took first.
  if (error.message.includes("Database error saving new user")) {
    return strings.auth.usernameTaken;
  }
  return strings.auth.generic;
}
