"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DownloadIcon } from "./Icons";
import { Button } from "./ui";

export function DownloadButton({ resourceId, allowed, signedIn }: { resourceId: string; allowed: boolean; signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (!signedIn) {
      router.push("/login");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/resources/${resourceId}/download`, { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Download failed.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resourceId}-demo.txt`;
    a.click();
    URL.revokeObjectURL(url);
    router.refresh();
  }

  return (
    <div>
      <Button variant="secondary" onClick={handleDownload} disabled={busy || (signedIn && !allowed)}>
        <DownloadIcon className="h-4 w-4" />
        {busy ? "Preparing…" : "Download"}
      </Button>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
