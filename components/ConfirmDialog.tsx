"use client";

import { useState, ReactNode } from "react";
import { Button } from "./ui";

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-1.5 text-sm text-muted">{description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)} disabled={busy}>
                Cancel
              </Button>
              <Button
                variant={danger ? "danger" : "primary"}
                size="sm"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  await onConfirm();
                  setBusy(false);
                  setOpen(false);
                }}
              >
                {busy ? "Working…" : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
