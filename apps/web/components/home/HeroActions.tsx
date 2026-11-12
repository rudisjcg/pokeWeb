"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Button from "@/components/ui/Button";
import { strings } from "@/lib/strings";

export default function HeroActions() {
  const { profile, loading, openSignUp } = useAuth();

  return (
    <div className="flex flex-wrap gap-3 mt-9">
      <Button href="/pokedex" size="lg">
        {strings.home.explore}
      </Button>
      {profile ? (
        <Button href="/mylist" size="lg" variant="ghost">
          {strings.home.myList}
        </Button>
      ) : (
        <Button size="lg" variant="ghost" onClick={openSignUp} disabled={loading}>
          {strings.home.createAccount}
        </Button>
      )}
    </div>
  );
}
