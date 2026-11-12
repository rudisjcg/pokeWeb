import { describe, expect, it } from "vitest";
import { authErrorMessage } from "./authErrors";
import { strings } from "./strings";

describe("authErrorMessage", () => {
  it("explains wrong credentials", () => {
    expect(authErrorMessage({ code: "invalid_credentials", message: "Invalid login credentials" })).toBe(
      strings.auth.invalidCredentials,
    );
  });

  it("explains an already registered email", () => {
    expect(authErrorMessage({ code: "user_already_exists", message: "User already registered" })).toBe(
      strings.auth.userExists,
    );
  });

  it("explains a weak password", () => {
    expect(authErrorMessage({ code: "weak_password", message: "Password should be at least 6 characters" })).toBe(
      strings.auth.weakPassword,
    );
  });

  it("explains an unconfirmed email", () => {
    expect(authErrorMessage({ code: "email_not_confirmed", message: "Email not confirmed" })).toBe(
      strings.auth.emailNotConfirmed,
    );
  });

  it("explains a taken username when the profile cannot be created", () => {
    expect(authErrorMessage({ code: "unexpected_failure", message: "Database error saving new user" })).toBe(
      strings.auth.usernameTaken,
    );
  });

  it("falls back to a generic message without leaking internals", () => {
    expect(authErrorMessage({ code: "something_new", message: "pg: relation 42P01 secret detail" })).toBe(
      strings.auth.generic,
    );
    expect(authErrorMessage({ message: "boom" })).toBe(strings.auth.generic);
  });
});
