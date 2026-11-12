"use client";

import { validateUsername } from "@pokeweb/shared";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authErrorMessage } from "@/lib/authErrors";
import { AVATARS } from "@/lib/constants";
import { strings } from "@/lib/strings";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Panel from "@/components/ui/Panel";
import Modal from "./Modal";

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
    <Modal open={open} onClose={handleClose} label={strings.auth.signUpTitle} className="w-[460px]">
      <Panel className="p-6 sm:p-8">
        {confirmationSent ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-[28px]">{strings.auth.signUpTitle}</h2>
            <p role="status">{strings.auth.checkEmail}</p>
            <Button onClick={handleClose}>{strings.auth.close}</Button>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <h2 className="text-[28px]">{strings.auth.signUpTitle}</h2>
            <Field
              label={strings.auth.username}
              type="text"
              autoComplete="username"
              error={usernameError}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Field
              label={strings.auth.email}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Field
              label={strings.auth.password}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" size="lg" disabled={working}>
              {working ? strings.auth.working : strings.auth.submitSignUp}
            </Button>
          </form>
        )}
      </Panel>
    </Modal>
  );
}
