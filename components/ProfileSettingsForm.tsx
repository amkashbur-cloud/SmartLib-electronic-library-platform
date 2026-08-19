"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, FieldLabel, Input } from "./ui";
import type { PublicUser } from "@/lib/types";

export function ProfileSettingsForm({ user }: { user: PublicUser }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.full_name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "danger"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function saveName() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName }),
    });
    setBusy(false);
    const data = await res.json();
    if (!res.ok) {
      setMessage({ tone: "danger", text: data.message ?? "Could not update name." });
      return;
    }
    setMessage({ tone: "success", text: "Name updated." });
    router.refresh();
  }

  async function changePassword() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    setBusy(false);
    const data = await res.json();
    if (!res.ok) {
      setMessage({ tone: "danger", text: data.message ?? "Could not update password." });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMessage({ tone: "success", text: "Password updated." });
  }

  return (
    <div className="space-y-6">
      {message && <Alert tone={message.tone}>{message.text}</Alert>}

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-medium text-foreground">Full name</p>
        <div className="mt-2 flex gap-2">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} />
          <Button size="sm" onClick={saveName} disabled={busy}>Save</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm font-medium text-foreground">Change password</p>
        <div className="mt-2 space-y-2">
          <div>
            <FieldLabel htmlFor="current_password">Current password</FieldLabel>
            <Input id="current_password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="new_password">New password</FieldLabel>
            <Input id="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} />
          </div>
          <Button size="sm" onClick={changePassword} disabled={busy || !currentPassword || !newPassword}>
            Update password
          </Button>
        </div>
      </div>
    </div>
  );
}
