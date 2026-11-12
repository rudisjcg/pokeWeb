"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authErrorMessage } from "@/lib/authErrors";
import { strings } from "@/lib/strings";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Panel from "@/components/ui/Panel";
import Modal from "./Modal";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) {
      toast.error(strings.auth.missingFields);
      return;
    }

    setWorking(true);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    setWorking(false);

    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }
    setPassword("");
    onClose();
    router.refresh();
  }

  async function handleGoogle() {
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(authErrorMessage(error));
  }

  return (
    <Modal open={open} onClose={onClose} label={strings.auth.loginTitle} className="w-[460px]">
      <Panel className="p-6 sm:p-8">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <h2 className="text-[28px]">{strings.auth.loginTitle}</h2>
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" size="lg" disabled={working}>
            {working ? strings.auth.working : strings.auth.submitLogin}
          </Button>
          <Button variant="ghost" onClick={handleGoogle}>
            {strings.auth.google}
          </Button>
        </form>
      </Panel>
    </Modal>
  );
}
