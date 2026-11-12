"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/client";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

export type AuthProfile = { id: string; username: string; avatarUrl: string | null };
type OpenModal = "login" | "signup" | null;

type AuthContextValue = {
  /** Null while signed out. */
  profile: AuthProfile | null;
  /** True until the stored session has been read; avoids flashing signed-out UI. */
  loading: boolean;
  openLogin: () => void;
  openSignUp: () => void;
  close: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

/** Opens the login when a protected page redirected here with ?login=1. */
function LoginParamWatcher({ onLoginRequested }: { onLoginRequested: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requested = searchParams.get("login") === "1";

  useEffect(() => {
    if (!requested) return;
    onLoginRequested();
    router.replace("/");
  }, [requested, onLoginRequested, router]);

  return null;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionRead, setSessionRead] = useState(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setSessionRead(true);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    void supabase
      .from("profiles")
      .select("id, username, avatar_url")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setProfile(data ? { id: data.id, username: data.username, avatarUrl: data.avatar_url } : null);
      });

    return () => {
      cancelled = true;
    };
  }, [supabase, userId]);

  const openLogin = useCallback(() => setOpenModal("login"), []);
  const openSignUp = useCallback(() => setOpenModal("signup"), []);
  const close = useCallback(() => setOpenModal(null), []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [supabase, router]);

  const currentProfile = userId && profile?.id === userId ? profile : null;
  const loading = !sessionRead || (userId !== null && currentProfile === null);

  const value = useMemo<AuthContextValue>(
    () => ({ profile: currentProfile, loading, openLogin, openSignUp, close, signOut }),
    [currentProfile, loading, openLogin, openSignUp, close, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        <LoginParamWatcher onLoginRequested={openLogin} />
      </Suspense>
      <LoginModal open={openModal === "login"} onClose={close} />
      <SignUpModal open={openModal === "signup"} onClose={close} />
      <Toaster theme="dark" />
    </AuthContext.Provider>
  );
}
