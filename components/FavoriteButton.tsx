"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartIcon } from "./Icons";
import { Button } from "./ui";

export function FavoriteButton({ resourceId, initialFavorited, signedIn }: { resourceId: string; initialFavorited: boolean; signedIn: boolean }) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push("/login");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource_id: resourceId }),
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
      router.refresh();
    }
  }

  return (
    <Button variant={favorited ? "primary" : "secondary"} onClick={toggle} disabled={busy}>
      <HeartIcon className="h-4 w-4" filled={favorited} />
      {favorited ? "Favorited" : "Add to favorites"}
    </Button>
  );
}
