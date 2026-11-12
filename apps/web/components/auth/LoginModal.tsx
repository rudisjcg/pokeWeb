"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authErrorMessage } from "@/lib/authErrors";
import { strings } from "@/lib/strings";
import { createClient } from "@/lib/supabase/client";
import Modal from "./Modal";

const inputClass = "h-10 mt-8 rounded-md bg-transparent border border-gray-700 p-6";

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
    <Modal open={open} onClose={onClose} label={strings.auth.loginTitle} className="w-[90%] md:w-[560px]">
      <div className="w-full bg-black text-white border border-gray-700 rounded-lg flex justify-center pb-8">
        <form className="w-[90%] mt-8 flex flex-col" onSubmit={handleSubmit} noValidate>
          <h1 className="mt-4 font-bold text-4xl">{strings.auth.loginTitle}</h1>
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
            autoComplete="current-password"
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
            {working ? strings.auth.working : strings.auth.submitLogin}
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            className="bg-transparent border border-white text-white w-full font-bold text-lg p-2 mt-4 rounded-md"
          >
            {strings.auth.google}
          </button>
        </form>
      </div>
    </Modal>
  );
}
