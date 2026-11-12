"use client";

import { validateUsername } from "@pokeweb/shared";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authErrorMessage } from "@/lib/authErrors";
import { AVATARS } from "@/lib/constants";
import { strings } from "@/lib/strings";
import { createClient } from "@/lib/supabase/client";
import Modal from "./Modal";

const inputClass = "h-10 mt-8 rounded-md bg-transparent border border-gray-700 p-6";

function randomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)] ?? "/assets/profilePictures/pfp1.png";
}

export default function SignUpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateUsername(username);
    if (!validation.ok) {
      setUsernameError(validation.reason === "length" ? strings.auth.usernameLength : strings.auth.usernameChars);
      return;
    }
    setUsernameError(null);

    if (!email.trim() || !password) {
      toast.error(strings.auth.missingFields);
      return;
    }

    setWorking(true);
    const supabase = createClient();

    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", validation.username)
      .maybeSingle();
    if (taken) {
      setWorking(false);
      setUsernameError(strings.auth.usernameTaken);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: validation.username, avatar_url: randomAvatar() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setWorking(false);

    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }

    setPassword("");
    if (data.session) {
      onClose();
    } else {
      setConfirmationSent(true);
    }
  }

  function handleClose() {
    setConfirmationSent(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} label={strings.auth.signUpTitle} className="w-[90%] md:w-[560px]">
      <div className="w-full bg-black text-white border border-gray-700 rounded-lg flex justify-center pb-8">
        {confirmationSent ? (
          <div className="w-[90%] mt-8 flex flex-col">
            <h1 className="mt-4 font-bold text-4xl">{strings.auth.signUpTitle}</h1>
            <p className="mt-8" role="status">
              {strings.auth.checkEmail}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="bg-white text-black w-full font-bold text-lg p-2 mt-8 rounded-md"
            >
              {strings.auth.close}
            </button>
          </div>
        ) : (
          <form className="w-[90%] mt-8 flex flex-col" onSubmit={handleSubmit} noValidate>
            <h1 className="mt-4 font-bold text-4xl">{strings.auth.signUpTitle}</h1>
            <input
              aria-label={strings.auth.username}
              aria-invalid={usernameError !== null}
              aria-describedby={usernameError ? "signup-username-error" : undefined}
              placeholder={strings.auth.username}
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={inputClass}
              type="text"
            />
            {usernameError && (
              <p id="signup-username-error" role="alert" className="mt-2 text-red-400 text-sm">
                {usernameError}
              </p>
            )}
            <input
              aria-label={strings.auth.email}
              placeholder={strings.auth.email}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              type="email"
            />
            <input
              aria-label={strings.auth.password}
              placeholder={strings.auth.password}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              type="password"
            />
            <button
              type="submit"
              disabled={working}
              className="bg-white text-black w-full font-bold text-lg p-2 mt-8 rounded-md disabled:opacity-60"
            >
              {working ? strings.auth.working : strings.auth.submitSignUp}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
