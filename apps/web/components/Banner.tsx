"use client";

import { strings } from "@/lib/strings";
import { useAuth } from "./auth/AuthProvider";

/** Sign-in call to action pinned to the bottom of the page for signed-out visitors. */
export default function Banner() {
  const { profile, loading, openLogin, openSignUp } = useAuth();
  if (loading || profile) return null;

  return (
    <div className="flex xl:space-x-[200px] justify-center items-center fixed w-full h-[80px] bg-primary bottom-0">
      <div className="hidden xl:inline text-white">
        <p className="text-2xl font-bold">{strings.banner.title}</p>
      </div>
      <div className="space-x-3 ">
        <button
          type="button"
          className="bg-transparent border border-white text-white w-[160px] rounded-full h-[40px] hover:bg-[#cbd2d7] transition-all"
          onClick={openLogin}
        >
          {strings.auth.logIn}
        </button>
        <button
          type="button"
          className="bg-white text-black w-[160px] rounded-full h-[40px] hover:bg-[#cbd2d7] transition-all"
          onClick={openSignUp}
        >
          {strings.auth.signUp}
        </button>
      </div>
    </div>
  );
}
