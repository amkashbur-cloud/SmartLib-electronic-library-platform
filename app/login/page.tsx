"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, Button, FieldLabel, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        remember: form.get("remember") === "on",
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "Something went wrong.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Welcome back to SmartLib.</p>

        {error && (
          <div className="mt-4">
            <Alert tone="danger">{error}</Alert>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          </div>
          <div>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" name="remember" className="rounded border-border" />
              Remember me
            </label>
            <span className="text-muted">Forgot password? Contact an admin.</span>
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-brand hover:underline">
            Create one
          </Link>
        </p>
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-center text-xs text-muted">
          Demo accounts: any seeded email · password <code className="font-mono">Password123</code>
          <br />
          e.g. <code className="font-mono">admin@smartlib.edu</code> / <code className="font-mono">sara.student@smartlib.edu</code>
        </p>
      </div>
    </div>
  );
}
